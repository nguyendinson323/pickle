import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    status: string;
    category: string;
    location: string;
  };
  includeImages: boolean;
  emailReport: boolean;
  emailAddress?: string;
}

export interface TournamentData {
  id: string;
  name: string;
  date: string;
  location: string;
  status: string;
  category: string;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  prize: number;
}

export interface PlayerData {
  id: string;
  name: string;
  email: string;
  skillLevel: string;
  location: string;
  status: string;
  registrationDate: string;
  tournamentsPlayed: number;
  winRate: number;
}

export interface AnalyticsData {
  period: string;
  tournaments: number;
  players: number;
  revenue: number;
  growth: number;
  topStates: Array<{ state: string; count: number }>;
  popularCategories: Array<{ category: string; count: number }>;
}

class ExportService {
  private filterData<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions
  ): T[] {
    return data.filter(item => {
      // Date range filter
      if (item.date) {
        const itemDate = new Date(item.date);
        const startDate = new Date(options.dateRange.start);
        const endDate = new Date(options.dateRange.end);
        if (itemDate < startDate || itemDate > endDate) {
          return false;
        }
      }

      // Status filter
      if (options.filters.status && item.status !== options.filters.status) {
        return false;
      }

      // Category filter
      if (options.filters.category && item.category !== options.filters.category) {
        return false;
      }

      // Location filter
      if (options.filters.location) {
        const locationMatch = item.location?.toLowerCase().includes(options.filters.location.toLowerCase()) ||
                             item.state?.toLowerCase() === options.filters.location.toLowerCase();
        if (!locationMatch) {
          return false;
        }
      }

      return true;
    });
  }

  async exportTournaments(
    data: TournamentData[],
    options: ExportOptions
  ): Promise<void> {
    const filteredData = this.filterData(data, options);

    switch (options.format) {
      case 'pdf':
        await this.exportTournamentsPDF(filteredData, options);
        break;
      case 'excel':
        this.exportTournamentsExcel(filteredData);
        break;
      case 'csv':
        this.exportTournamentsCSV(filteredData);
        break;
      case 'json':
        this.exportJSON(filteredData, 'tournaments');
        break;
    }

    if (options.emailReport && options.emailAddress) {
      await this.sendEmailReport(options.emailAddress, 'tournaments', options.format);
    }
  }

  async exportPlayers(
    data: PlayerData[],
    options: ExportOptions
  ): Promise<void> {
    const filteredData = this.filterData(data, options);

    switch (options.format) {
      case 'pdf':
        await this.exportPlayersPDF(filteredData, options);
        break;
      case 'excel':
        this.exportPlayersExcel(filteredData);
        break;
      case 'csv':
        this.exportPlayersCSV(filteredData);
        break;
      case 'json':
        this.exportJSON(filteredData, 'players');
        break;
    }

    if (options.emailReport && options.emailAddress) {
      await this.sendEmailReport(options.emailAddress, 'players', options.format);
    }
  }

  async exportAnalytics(
    data: AnalyticsData,
    options: ExportOptions
  ): Promise<void> {
    switch (options.format) {
      case 'pdf':
        await this.exportAnalyticsPDF(data, options);
        break;
      case 'excel':
        this.exportAnalyticsExcel(data);
        break;
      case 'csv':
        this.exportAnalyticsCSV(data);
        break;
      case 'json':
        this.exportJSON(data, 'analytics');
        break;
    }

    if (options.emailReport && options.emailAddress) {
      await this.sendEmailReport(options.emailAddress, 'analytics', options.format);
    }
  }

  private async exportTournamentsPDF(
    data: TournamentData[],
    options: ExportOptions
  ): Promise<void> {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Tournament Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Period: ${options.dateRange.start} to ${options.dateRange.end}`, 20, 45);
    
    // Summary
    doc.setFontSize(14);
    doc.text('Summary', 20, 65);
    doc.setFontSize(12);
    doc.text(`Total Tournaments: ${data.length}`, 20, 80);
    doc.text(`Total Revenue: $${data.reduce((sum, t) => sum + (t.entryFee * t.participants), 0).toLocaleString()}`, 20, 90);
    doc.text(`Total Participants: ${data.reduce((sum, t) => sum + t.participants, 0)}`, 20, 100);
    
    // Table
    const tableData = data.map(tournament => [
      tournament.name,
      tournament.date,
      tournament.location,
      tournament.status,
      tournament.category,
      tournament.participants.toString(),
      `$${tournament.entryFee}`
    ]);

    (doc as any).autoTable({
      head: [['Name', 'Date', 'Location', 'Status', 'Category', 'Participants', 'Entry Fee']],
      body: tableData,
      startY: 120,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    doc.save(`tournaments-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private async exportPlayersPDF(
    data: PlayerData[],
    options: ExportOptions
  ): Promise<void> {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Player Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Summary
    doc.setFontSize(14);
    doc.text('Summary', 20, 55);
    doc.setFontSize(12);
    doc.text(`Total Players: ${data.length}`, 20, 70);
    doc.text(`Active Players: ${data.filter(p => p.status === 'active').length}`, 20, 80);
    doc.text(`Average Skill Level: ${(data.reduce((sum, p) => sum + parseFloat(p.skillLevel), 0) / data.length).toFixed(1)}`, 20, 90);
    
    // Table
    const tableData = data.map(player => [
      player.name,
      player.email,
      player.skillLevel,
      player.location,
      player.status,
      player.tournamentsPlayed.toString(),
      `${(player.winRate * 100).toFixed(1)}%`
    ]);

    (doc as any).autoTable({
      head: [['Name', 'Email', 'Skill Level', 'Location', 'Status', 'Tournaments', 'Win Rate']],
      body: tableData,
      startY: 110,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    doc.save(`players-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private async exportAnalyticsPDF(
    data: AnalyticsData,
    options: ExportOptions
  ): Promise<void> {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Analytics Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Period: ${data.period}`, 20, 45);
    
    // Key Metrics
    doc.setFontSize(14);
    doc.text('Key Metrics', 20, 65);
    doc.setFontSize(12);
    doc.text(`Total Tournaments: ${data.tournaments}`, 20, 80);
    doc.text(`Total Players: ${data.players}`, 20, 90);
    doc.text(`Total Revenue: $${data.revenue.toLocaleString()}`, 20, 100);
    doc.text(`Growth Rate: ${data.growth > 0 ? '+' : ''}${data.growth.toFixed(1)}%`, 20, 110);
    
    // Top States
    doc.setFontSize(14);
    doc.text('Top States by Activity', 20, 135);
    let yPos = 150;
    data.topStates.forEach((state, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${state.state}: ${state.count} tournaments`, 30, yPos);
      yPos += 10;
    });
    
    // Popular Categories
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Popular Categories', 20, yPos);
    yPos += 15;
    data.popularCategories.forEach((category, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${category.category}: ${category.count} tournaments`, 30, yPos);
      yPos += 10;
    });

    doc.save(`analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private exportTournamentsExcel(data: TournamentData[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tournaments');
    XLSX.writeFile(workbook, `tournaments-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  private exportPlayersExcel(data: PlayerData[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Players');
    XLSX.writeFile(workbook, `players-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  private exportAnalyticsExcel(data: AnalyticsData): void {
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      { Metric: 'Period', Value: data.period },
      { Metric: 'Total Tournaments', Value: data.tournaments },
      { Metric: 'Total Players', Value: data.players },
      { Metric: 'Total Revenue', Value: data.revenue },
      { Metric: 'Growth Rate (%)', Value: data.growth }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Top States sheet
    const statesSheet = XLSX.utils.json_to_sheet(data.topStates);
    XLSX.utils.book_append_sheet(workbook, statesSheet, 'Top States');
    
    // Popular Categories sheet
    const categoriesSheet = XLSX.utils.json_to_sheet(data.popularCategories);
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');
    
    XLSX.writeFile(workbook, `analytics-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  private exportTournamentsCSV(data: TournamentData[]): void {
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, `tournaments-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private exportPlayersCSV(data: PlayerData[]): void {
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, `players-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private exportAnalyticsCSV(data: AnalyticsData): void {
    const csvData = [
      { type: 'summary', period: data.period, tournaments: data.tournaments, players: data.players, revenue: data.revenue, growth: data.growth },
      ...data.topStates.map(state => ({ type: 'state', ...state })),
      ...data.popularCategories.map(category => ({ type: 'category', ...category }))
    ];
    const csv = this.convertToCSV(csvData);
    this.downloadCSV(csv, `analytics-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private exportJSON(data: any, filename: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private async sendEmailReport(
    email: string,
    reportType: string,
    format: string
  ): Promise<void> {
    // Mock email service - in real implementation, this would call your backend API
    console.log(`Sending ${reportType} report in ${format} format to ${email}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = `Report sent successfully to ${email}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  // Real data fetchers using your backend APIs
  async getRealTournamentData(filters: ExportOptions): Promise<TournamentData[]> {
    try {
      const params = new URLSearchParams({
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end,
        status: filters.filters.status,
        category: filters.filters.category,
        location: filters.filters.location
      });

      const response = await fetch(`/api/tournaments/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      
      return (data.tournaments || []).map((tournament: any) => ({
        id: tournament.id,
        name: tournament.name,
        date: tournament.startDate || tournament.date,
        location: tournament.location,
        status: tournament.status,
        category: tournament.category,
        participants: tournament.currentParticipants || 0,
        maxParticipants: tournament.maxParticipants,
        entryFee: tournament.entryFee,
        prize: tournament.prizeAmount || 0
      }));
    } catch (error) {
      console.error('Failed to fetch tournament data:', error);
      return [];
    }
  }

  async getRealPlayerData(filters: ExportOptions): Promise<PlayerData[]> {
    try {
      const response = await fetch('/api/location/search-players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          state: filters.filters.location,
          skillLevel: filters.filters.category,
          status: filters.filters.status
        })
      });

      const data = await response.json();
      
      return (data.players || []).map((player: any) => ({
        id: player.id,
        name: player.name || `${player.firstName} ${player.lastName}`,
        email: player.email,
        skillLevel: player.skillLevel,
        location: `${player.city}, ${player.state}`,
        status: player.status || 'active',
        registrationDate: player.createdAt,
        tournamentsPlayed: player.tournamentsPlayed || 0,
        winRate: player.winRate || 0
      }));
    } catch (error) {
      console.error('Failed to fetch player data:', error);
      return [];
    }
  }

  async getRealAnalyticsData(): Promise<AnalyticsData> {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      
      return {
        period: data.period || 'Current',
        tournaments: data.totalTournaments || 0,
        players: data.totalPlayers || 0,
        revenue: data.totalRevenue || 0,
        growth: data.growthRate || 0,
        topStates: data.topStates || [],
        popularCategories: data.popularCategories || []
      };
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return {
        period: 'Current',
        tournaments: 0,
        players: 0,
        revenue: 0,
        growth: 0,
        topStates: [],
        popularCategories: []
      };
    }
  }
}

export const exportService = new ExportService();
export default exportService;