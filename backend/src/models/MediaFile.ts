import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MediaFileAttributes {
  id: number;
  micrositeId: number;
  userId: number;
  originalName: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
}

interface MediaFileCreationAttributes extends Optional<MediaFileAttributes, 'id'> {}

class MediaFile extends Model<MediaFileAttributes, MediaFileCreationAttributes> implements MediaFileAttributes {
  public id!: number;
  public micrositeId!: number;
  public userId!: number;
  public originalName!: string;
  public fileName!: string;
  public filePath!: string;
  public fileUrl!: string;
  public mimeType!: string;
  public fileSize!: number;
  public alt?: string;
  public title?: string;
  public description?: string;
  public tags?: string[];
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MediaFile.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  micrositeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'microsites',
      key: 'id'
    },
    onDelete: 'CASCADE',
    field: 'microsite_id'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    field: 'user_id'
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'original_name'
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'file_name'
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_path'
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_url'
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'mime_type'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'file_size'
  },
  alt: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_public'
  }
}, {
  sequelize,
  modelName: 'MediaFile',
  tableName: 'media_files',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['microsite_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['mime_type']
    },
    {
      fields: ['is_public']
    }
  ]
});

export default MediaFile;