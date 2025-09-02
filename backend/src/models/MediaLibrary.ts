import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MediaLibraryAttributes {
  id: number;
  micrositeId: number;
  userId: number;
  
  // File info
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  
  // Storage
  storageProvider: 'local' | 'aws_s3' | 'cloudinary';
  storageKey: string;
  url: string;
  thumbnailUrl?: string;
  
  // Metadata
  alt: string;
  caption?: string;
  tags: string[];
  
  // Organization
  folder?: string;
  category: 'image' | 'video' | 'document' | 'audio';
  
  // Usage tracking
  usageCount: number;
  lastUsedAt?: Date;
}

interface MediaLibraryCreationAttributes extends Optional<MediaLibraryAttributes, 'id'> {}

class MediaLibrary extends Model<MediaLibraryAttributes, MediaLibraryCreationAttributes> implements MediaLibraryAttributes {
  public id!: number;
  public micrositeId!: number;
  public userId!: number;
  
  // File info
  public filename!: string;
  public originalName!: string;
  public mimeType!: string;
  public size!: number;
  public dimensions?: {
    width: number;
    height: number;
  };
  
  // Storage
  public storageProvider!: 'local' | 'aws_s3' | 'cloudinary';
  public storageKey!: string;
  public url!: string;
  public thumbnailUrl?: string;
  
  // Metadata
  public alt!: string;
  public caption?: string;
  public tags!: string[];
  
  // Organization
  public folder?: string;
  public category!: 'image' | 'video' | 'document' | 'audio';
  
  // Usage tracking
  public usageCount!: number;
  public lastUsedAt?: Date;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper methods
  public isImage(): boolean {
    return this.category === 'image';
  }

  public isVideo(): boolean {
    return this.category === 'video';
  }

  public isDocument(): boolean {
    return this.category === 'document';
  }

  public getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }

  public async incrementUsage(): Promise<void> {
    await this.update({
      usageCount: this.usageCount + 1,
      lastUsedAt: new Date()
    });
  }

  public hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  public addTag(tag: string): void {
    if (!this.hasTag(tag)) {
      this.tags = [...this.tags, tag];
    }
  }

  public removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }
}

MediaLibrary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    micrositeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'microsites',
        key: 'id',
      },
      field: 'microsite_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      field: 'user_id',
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_name',
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mime_type',
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dimensions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    storageProvider: {
      type: DataTypes.ENUM('local', 'aws_s3', 'cloudinary'),
      allowNull: false,
      defaultValue: 'local',
      field: 'storage_provider',
    },
    storageKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'storage_key',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'thumbnail_url',
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    folder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('image', 'video', 'document', 'audio'),
      allowNull: false,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'usage_count',
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_used_at',
    },
  },
  {
    sequelize,
    tableName: 'media_library',
    timestamps: true,
  underscored: true,
    indexes: [
      {
        fields: ['microsite_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['mime_type'],
      },
      {
        fields: ['storage_key'],
        unique: true,
      },
    ],
  }
);


export default MediaLibrary;