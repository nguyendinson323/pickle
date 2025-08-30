import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { createMicrosite, fetchThemes } from '../../store/micrositeSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import SelectField from '../forms/SelectField';
import { useNavigate } from 'react-router-dom';

interface CreateMicrositeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerType?: string;
}

const CreateMicrositeModal: React.FC<CreateMicrositeModalProps> = ({
  isOpen,
  onClose,
  ownerType,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { themes, saving } = useSelector((state: RootState) => state.microsites);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    title: '',
    description: '',
    themeId: '',
    ownerType: ownerType || 'club',
    ownerId: 1, // This should be dynamically set based on user's profile
    seoTitle: '',
    seoDescription: '',
    contactEmail: user?.email || '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchThemes());
      // Reset form when modal opens
      setFormData({
        name: '',
        subdomain: '',
        title: '',
        description: '',
        themeId: themes.find(theme => theme.isDefault)?.id?.toString() || '',
        ownerType: ownerType || 'club',
        ownerId: 1,
        seoTitle: '',
        seoDescription: '',
        contactEmail: user?.email || '',
        contactPhone: '',
        address: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedin: '',
        },
      });
      setErrors({});
    }
  }, [isOpen, dispatch, themes, ownerType, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate subdomain from name
    if (field === 'name' && !formData.subdomain) {
      const subdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50);
      setFormData(prev => ({ ...prev, subdomain }));
    }

    // Auto-generate title from name
    if (field === 'name' && !formData.title) {
      setFormData(prev => ({ ...prev, title: value }));
    }

    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'El subdominio es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'El subdominio solo puede contener letras minúsculas, números y guiones';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'El subdominio debe tener al menos 3 caracteres';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email de contacto es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'El email no tiene un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(createMicrosite({
        ...formData,
        themeId: formData.themeId ? parseInt(formData.themeId) : undefined,
        settings: {
          showBookingIntegration: ownerType === 'club' || ownerType === 'partner',
          showTournamentList: true,
          allowRegistrations: true,
        },
      }));

      if (createMicrosite.fulfilled.match(result)) {
        onClose();
        navigate(`/dashboard/microsites/${result.payload.id}/edit`);
      }
    } catch (error) {
      console.error('Error creating microsite:', error);
    }
  };

  const themeOptions = themes.map(theme => ({
    value: theme.id.toString(),
    label: theme.name,
    description: theme.description,
  }));

  const ownerTypeOptions = [
    { value: 'club', label: 'Club' },
    { value: 'partner', label: 'Socio/Partner' },
    { value: 'state', label: 'Comité Estatal' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Micrositio" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
          
          <FormField
            label="Nombre del Micrositio"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Club Pickleball Ciudad de México"
            />
          </FormField>

          <FormField
            label="Subdominio"
            required
            error={errors.subdomain}
            help="Solo letras minúsculas, números y guiones. Mínimo 3 caracteres."
          >
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                value={formData.subdomain}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="mi-club-pickleball"
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                .pickleballfed.mx
              </span>
            </div>
          </FormField>

          <FormField
            label="Título del Sitio"
            required
            error={errors.title}
          >
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Club Pickleball Ciudad de México"
            />
          </FormField>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe tu organización y lo que ofreces..."
            />
          </div>

          <SelectField
            name="ownerType"
            label="Tipo de Organización"
            value={formData.ownerType}
            onChange={(value) => handleInputChange('ownerType', value)}
            options={ownerTypeOptions}
            required
          />

          <SelectField
            name="themeId"
            label="Tema"
            value={formData.themeId}
            onChange={(value) => handleInputChange('themeId', value)}
            options={themeOptions}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
          
          <FormField
            label="Email de Contacto"
            required
            error={errors.contactEmail}
          >
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </FormField>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto
              </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: +52 55 1234 5678"
            />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dirección física de tu organización"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://facebook.com/tu-pagina"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://instagram.com/tu-cuenta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://twitter.com/tu-cuenta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.socialMedia.linkedin}
                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/company/tu-empresa"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">SEO (Opcional)</h3>
          
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título SEO
              </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción SEO
              </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? 'Creando...' : 'Crear Micrositio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateMicrositeModal;