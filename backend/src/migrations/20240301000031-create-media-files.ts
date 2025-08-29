import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('media_files', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uploader_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    original_filename: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    file_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    cdn_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    file_type: {
      type: DataTypes.ENUM('image', 'video', 'audio', 'document', 'archive', 'other'),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    file_extension: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    checksum: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quality: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    resolution: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    aspect_ratio: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    color_space: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bit_rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    frame_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    thumbnail_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    preview_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    compressed_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    alt_text: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    exif_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    location_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    camera_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    usage_context: {
      type: DataTypes.ENUM('profile_picture', 'banner', 'gallery', 'document', 'tournament', 'court', 'logo', 'other'),
      defaultValue: 'other',
      allowNull: false
    },
    related_entity_type: {
      type: DataTypes.ENUM('none', 'user', 'tournament', 'court', 'club', 'microsite', 'message', 'post'),
      defaultValue: 'none',
      allowNull: false
    },
    related_entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    storage_provider: {
      type: DataTypes.ENUM('local', 'aws_s3', 'cloudinary', 'azure', 'gcp'),
      defaultValue: 'local',
      allowNull: false
    },
    storage_bucket: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    storage_region: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    storage_path: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    public_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    last_accessed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    processing_status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending',
      allowNull: false
    },
    processing_error: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    processing_job_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    variants: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_optimized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    optimization_status: {
      type: DataTypes.ENUM('none', 'pending', 'completed', 'failed'),
      defaultValue: 'none',
      allowNull: false
    },
    original_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    optimized_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    compression_ratio: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    is_backup_created: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    backup_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    is_virus_scanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    virus_scan_status: {
      type: DataTypes.ENUM('pending', 'clean', 'infected', 'failed'),
      defaultValue: 'pending',
      allowNull: false
    },
    virus_scan_result: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    scanned_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_moderated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    moderation_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged'),
      defaultValue: 'pending',
      allowNull: false
    },
    moderation_result: {
      type: DataTypes.JSON,
      allowNull: true
    },
    moderated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    moderated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    moderation_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    copyright_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    license_type: {
      type: DataTypes.ENUM('all_rights_reserved', 'creative_commons', 'public_domain', 'custom'),
      defaultValue: 'all_rights_reserved',
      allowNull: false
    },
    license_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_temporary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    retention_period_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  });

  // Add indexes
  await queryInterface.addIndex('media_files', ['uploader_id']);
  await queryInterface.addIndex('media_files', ['moderated_by']);
  await queryInterface.addIndex('media_files', ['deleted_by']);
  await queryInterface.addIndex('media_files', ['file_type']);
  await queryInterface.addIndex('media_files', ['mime_type']);
  await queryInterface.addIndex('media_files', ['file_size']);
  await queryInterface.addIndex('media_files', ['usage_context']);
  await queryInterface.addIndex('media_files', ['related_entity_type']);
  await queryInterface.addIndex('media_files', ['related_entity_id']);
  await queryInterface.addIndex('media_files', ['storage_provider']);
  await queryInterface.addIndex('media_files', ['public_access']);
  await queryInterface.addIndex('media_files', ['processing_status']);
  await queryInterface.addIndex('media_files', ['is_processed']);
  await queryInterface.addIndex('media_files', ['optimization_status']);
  await queryInterface.addIndex('media_files', ['virus_scan_status']);
  await queryInterface.addIndex('media_files', ['moderation_status']);
  await queryInterface.addIndex('media_files', ['is_deleted']);
  await queryInterface.addIndex('media_files', ['expires_at']);
  await queryInterface.addIndex('media_files', ['is_temporary']);
  await queryInterface.addIndex('media_files', ['file_hash']);
  await queryInterface.addIndex('media_files', ['created_at']);
  await queryInterface.addIndex('media_files', ['related_entity_type', 'related_entity_id']);
  await queryInterface.addIndex('media_files', ['uploader_id', 'file_type']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('media_files');
}