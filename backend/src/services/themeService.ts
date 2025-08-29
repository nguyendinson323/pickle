import Theme from '../models/Theme';
import Microsite from '../models/Microsite';

export class ThemeService {
  async createTheme(data: any) {
    try {
      // If this is set as default, unset other default themes
      if (data.isDefault) {
        await Theme.update(
          { isDefault: false },
          { where: { isDefault: true } }
        );
      }

      const theme = await Theme.create({
        ...data,
        colorScheme: data.colorScheme || this.getDefaultColorScheme(),
        typography: data.typography || this.getDefaultTypography(),
        layout: data.layout || this.getDefaultLayout()
      });

      return theme;
    } catch (error) {
      throw error;
    }
  }

  async getThemeById(id: number) {
    try {
      const theme = await Theme.findByPk(id);

      if (!theme) {
        throw new Error('Theme not found');
      }

      return theme;
    } catch (error) {
      throw error;
    }
  }

  async getAllThemes(activeOnly: boolean = true) {
    try {
      const whereClause: any = {};

      if (activeOnly) {
        whereClause.isActive = true;
      }

      const themes = await Theme.findAll({
        where: whereClause,
        order: [['is_default', 'DESC'], ['name', 'ASC']]
      });

      return themes;
    } catch (error) {
      throw error;
    }
  }

  async getDefaultTheme() {
    try {
      let defaultTheme = await Theme.findOne({
        where: { isDefault: true, isActive: true }
      });

      if (!defaultTheme) {
        // If no default theme exists, create one
        defaultTheme = await this.createDefaultTheme();
      }

      return defaultTheme;
    } catch (error) {
      throw error;
    }
  }

  async updateTheme(id: number, data: any) {
    try {
      const theme = await Theme.findByPk(id);

      if (!theme) {
        throw new Error('Theme not found');
      }

      // If this is being set as default, unset other default themes
      if (data.isDefault && !theme.isDefault) {
        await Theme.update(
          { isDefault: false },
          { where: { isDefault: true } }
        );
      }

      await theme.update(data);

      return theme;
    } catch (error) {
      throw error;
    }
  }

  async deleteTheme(id: number) {
    try {
      const theme = await Theme.findByPk(id);

      if (!theme) {
        throw new Error('Theme not found');
      }

      // Check if theme is being used by any microsites
      const micrositeCount = await Microsite.count({
        where: { themeId: id }
      });

      if (micrositeCount > 0) {
        throw new Error('Cannot delete theme that is being used by microsites');
      }

      // Don't allow deleting the default theme if it's the only one
      if (theme.isDefault) {
        const otherThemes = await Theme.count({
          where: { id: { $ne: id }, isActive: true }
        });

        if (otherThemes === 0) {
          throw new Error('Cannot delete the only active theme');
        }
      }

      await theme.destroy();

      return { success: true, message: 'Theme deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async duplicateTheme(id: number, newName: string) {
    try {
      const originalTheme = await Theme.findByPk(id);

      if (!originalTheme) {
        throw new Error('Theme not found');
      }

      // Check if name is unique
      const existingTheme = await Theme.findOne({
        where: { name: newName }
      });

      if (existingTheme) {
        throw new Error('Theme name must be unique');
      }

      const duplicateData = {
        ...originalTheme.toJSON(),
        id: undefined,
        name: newName,
        isDefault: false,
        createdAt: undefined,
        updatedAt: undefined
      };

      const newTheme = await Theme.create(duplicateData);

      return newTheme;
    } catch (error) {
      throw error;
    }
  }

  async generateCss(themeId: number, customizations?: any) {
    try {
      const theme = await this.getThemeById(themeId);

      const colorScheme = { ...theme.colorScheme, ...customizations?.colorScheme };
      const typography = { ...theme.typography, ...customizations?.typography };
      const layout = { ...theme.layout, ...customizations?.layout };

      let css = `
        /* Theme: ${theme.name} */
        :root {
          /* Colors */
          --primary-color: ${colorScheme.primaryColor || '#007bff'};
          --secondary-color: ${colorScheme.secondaryColor || '#6c757d'};
          --accent-color: ${colorScheme.accentColor || '#28a745'};
          --background-color: ${colorScheme.backgroundColor || '#ffffff'};
          --text-color: ${colorScheme.textColor || '#212529'};
          --text-secondary: ${colorScheme.textSecondary || '#6c757d'};
          --border-color: ${colorScheme.borderColor || '#dee2e6'};
          --success-color: ${colorScheme.successColor || '#28a745'};
          --warning-color: ${colorScheme.warningColor || '#ffc107'};
          --error-color: ${colorScheme.errorColor || '#dc3545'};
          
          /* Typography */
          --font-family: ${typography.fontFamily || 'Arial, sans-serif'};
          --font-size-base: ${typography.fontSize || '16px'};
          --font-weight-normal: ${typography.fontWeightNormal || '400'};
          --font-weight-bold: ${typography.fontWeightBold || '700'};
          --line-height: ${typography.lineHeight || '1.5'};
          --heading-font-family: ${typography.headingFontFamily || 'inherit'};
          
          /* Layout */
          --container-max-width: ${layout.maxWidth || '1200px'};
          --section-padding: ${layout.sectionPadding || '60px 0'};
          --border-radius: ${layout.borderRadius || '4px'};
          --shadow: ${layout.boxShadow || '0 2px 4px rgba(0,0,0,0.1)'};
        }

        /* Base styles */
        body {
          font-family: var(--font-family);
          font-size: var(--font-size-base);
          line-height: var(--line-height);
          color: var(--text-color);
          background-color: var(--background-color);
        }

        .container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 15px;
        }

        /* Headings */
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--heading-font-family);
          font-weight: var(--font-weight-bold);
          color: var(--text-color);
        }

        /* Buttons */
        .btn {
          display: inline-block;
          padding: 10px 20px;
          border-radius: var(--border-radius);
          text-decoration: none;
          font-weight: var(--font-weight-normal);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background-color: color-mix(in srgb, var(--primary-color) 85%, black);
        }

        .btn-secondary {
          background-color: var(--secondary-color);
          color: white;
        }

        .btn-secondary:hover {
          background-color: color-mix(in srgb, var(--secondary-color) 85%, black);
        }

        /* Cards */
        .card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .card-body {
          padding: 20px;
        }

        /* Forms */
        .form-group {
          margin-bottom: 20px;
        }

        .form-control {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: var(--font-size-base);
          line-height: var(--line-height);
        }

        .form-control:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 2px rgba(var(--primary-color), 0.25);
        }

        /* Sections */
        .section {
          padding: var(--section-padding);
        }

        /* Navigation */
        .navbar {
          background: var(--background-color);
          border-bottom: 1px solid var(--border-color);
          padding: 15px 0;
        }

        .nav-link {
          color: var(--text-color);
          text-decoration: none;
          padding: 8px 15px;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary-color);
        }

        /* Footer */
        .footer {
          background: var(--text-color);
          color: white;
          padding: 40px 0;
          margin-top: 60px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 10px;
          }
          
          .section {
            padding: 40px 0;
          }
        }
      `;

      // Add custom CSS if provided
      if (theme.customCss) {
        css += `\n\n/* Custom CSS */\n${theme.customCss}`;
      }

      if (customizations?.customCss) {
        css += `\n\n/* Additional Custom CSS */\n${customizations.customCss}`;
      }

      return css;
    } catch (error) {
      throw error;
    }
  }

  private async createDefaultTheme() {
    const defaultThemeData = {
      name: 'Default',
      description: 'Clean and professional default theme',
      isDefault: true,
      isActive: true,
      colorScheme: this.getDefaultColorScheme(),
      typography: this.getDefaultTypography(),
      layout: this.getDefaultLayout(),
      settings: {}
    };

    return await Theme.create(defaultThemeData);
  }

  private getDefaultColorScheme() {
    return {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      accentColor: '#28a745',
      backgroundColor: '#ffffff',
      textColor: '#212529',
      textSecondary: '#6c757d',
      borderColor: '#dee2e6',
      successColor: '#28a745',
      warningColor: '#ffc107',
      errorColor: '#dc3545'
    };
  }

  private getDefaultTypography() {
    return {
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      fontSize: '16px',
      fontWeightNormal: '400',
      fontWeightBold: '700',
      lineHeight: '1.5',
      headingFontFamily: 'inherit'
    };
  }

  private getDefaultLayout() {
    return {
      maxWidth: '1200px',
      sectionPadding: '60px 0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };
  }

  async createSportsTheme() {
    return await this.createTheme({
      name: 'Sports',
      description: 'Dynamic theme for sports organizations',
      colorScheme: {
        primaryColor: '#ff6b35',
        secondaryColor: '#004e92',
        accentColor: '#ffd23f',
        backgroundColor: '#ffffff',
        textColor: '#2d3748',
        textSecondary: '#718096',
        borderColor: '#e2e8f0',
        successColor: '#38a169',
        warningColor: '#ed8936',
        errorColor: '#e53e3e'
      },
      typography: {
        fontFamily: '"Roboto", Arial, sans-serif',
        fontSize: '16px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeight: '1.6',
        headingFontFamily: '"Roboto Condensed", Arial, sans-serif'
      },
      settings: {
        category: 'sports'
      }
    });
  }

  async createMinimalTheme() {
    return await this.createTheme({
      name: 'Minimal',
      description: 'Clean and minimal design',
      colorScheme: {
        primaryColor: '#2d3748',
        secondaryColor: '#718096',
        accentColor: '#3182ce',
        backgroundColor: '#ffffff',
        textColor: '#1a202c',
        textSecondary: '#4a5568',
        borderColor: '#e2e8f0',
        successColor: '#38a169',
        warningColor: '#d69e2e',
        errorColor: '#e53e3e'
      },
      typography: {
        fontFamily: '"Inter", -apple-system, sans-serif',
        fontSize: '15px',
        fontWeightNormal: '400',
        fontWeightBold: '600',
        lineHeight: '1.5',
        headingFontFamily: 'inherit'
      },
      settings: {
        category: 'minimal'
      }
    });
  }

  async createCorporateTheme() {
    return await this.createTheme({
      name: 'Corporate',
      description: 'Professional corporate theme',
      colorScheme: {
        primaryColor: '#1e3a8a',
        secondaryColor: '#64748b',
        accentColor: '#0ea5e9',
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        textSecondary: '#475569',
        borderColor: '#e2e8f0',
        successColor: '#059669',
        warningColor: '#d97706',
        errorColor: '#dc2626'
      },
      typography: {
        fontFamily: '"Source Sans Pro", Arial, sans-serif',
        fontSize: '16px',
        fontWeightNormal: '400',
        fontWeightBold: '700',
        lineHeight: '1.5',
        headingFontFamily: '"Merriweather", serif'
      },
      settings: {
        category: 'corporate'
      }
    });
  }
}