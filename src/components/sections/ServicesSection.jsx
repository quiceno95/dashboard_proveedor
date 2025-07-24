import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Bed,
  Utensils,
  MapPin,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';

const ServicesSection = ({ userType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos de ejemplo según el tipo de usuario
  const getServicesData = () => {
    switch (userType) {
      case 'hotel':
        return [
          {
            id: 1,
            name: 'Habitación Estándar',
            description: 'Habitación con cama doble, baño privado y aire acondicionado',
            price: 150000,
            capacity: 2,
            status: 'active',
            category: 'Alojamiento',
            features: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado']
          },
          {
            id: 2,
            name: 'Suite Ejecutiva',
            description: 'Suite con sala de estar, minibar y vista panorámica',
            price: 300000,
            capacity: 4,
            status: 'active',
            category: 'Alojamiento',
            features: ['WiFi', 'TV', 'Minibar', 'Vista Panorámica', 'Jacuzzi']
          },
          {
            id: 3,
            name: 'Spa y Wellness',
            description: 'Tratamientos de relajación y bienestar',
            price: 80000,
            capacity: 1,
            status: 'active',
            category: 'Servicios Adicionales',
            features: ['Masajes', 'Sauna', 'Jacuzzi', 'Tratamientos Faciales']
          },
          {
            id: 4,
            name: 'Transporte Aeropuerto',
            description: 'Servicio de traslado desde/hacia el aeropuerto',
            price: 50000,
            capacity: 4,
            status: 'inactive',
            category: 'Transporte',
            features: ['Vehículo Privado', 'Conductor Profesional']
          }
        ];
      
      case 'restaurante':
        return [
          {
            id: 1,
            name: 'Menú Ejecutivo',
            description: 'Entrada, plato principal, postre y bebida',
            price: 35000,
            capacity: 1,
            status: 'active',
            category: 'Menús',
            features: ['Entrada', 'Plato Principal', 'Postre', 'Bebida']
          },
          {
            id: 2,
            name: 'Cena Romántica',
            description: 'Mesa privada con decoración especial para parejas',
            price: 120000,
            capacity: 2,
            status: 'active',
            category: 'Experiencias',
            features: ['Mesa Privada', 'Decoración Especial', 'Música Ambiental', 'Velas']
          },
          {
            id: 3,
            name: 'Buffet Dominical',
            description: 'Buffet libre con variedad de platos tradicionales',
            price: 45000,
            capacity: 1,
            status: 'active',
            category: 'Buffets',
            features: ['Buffet Libre', 'Platos Tradicionales', 'Postres', 'Bebidas']
          },
          {
            id: 4,
            name: 'Servicio de Catering',
            description: 'Catering para eventos corporativos y sociales',
            price: 25000,
            capacity: 10,
            status: 'inactive',
            category: 'Eventos',
            features: ['Servicio Completo', 'Montaje', 'Personal', 'Vajilla']
          }
        ];
      
      case 'tour':
        return [
          {
            id: 1,
            name: 'City Tour Histórico',
            description: 'Recorrido por los sitios históricos más importantes de la ciudad',
            price: 60000,
            capacity: 15,
            status: 'active',
            category: 'Tours Urbanos',
            features: ['Guía Profesional', 'Transporte', 'Entradas Incluidas', '4 horas']
          },
          {
            id: 2,
            name: 'Aventura en la Montaña',
            description: 'Senderismo y actividades de aventura en la montaña',
            price: 120000,
            capacity: 8,
            status: 'active',
            category: 'Aventura',
            features: ['Equipo Incluido', 'Guía Especializado', 'Almuerzo', 'Día completo']
          },
          {
            id: 3,
            name: 'Tour Gastronómico',
            description: 'Degustación de platos típicos en diferentes restaurantes',
            price: 80000,
            capacity: 12,
            status: 'active',
            category: 'Gastronomía',
            features: ['5 Restaurantes', 'Degustaciones', 'Bebidas', '3 horas']
          },
          {
            id: 4,
            name: 'Avistamiento de Aves',
            description: 'Tour especializado para observación de aves nativas',
            price: 90000,
            capacity: 6,
            status: 'inactive',
            category: 'Naturaleza',
            features: ['Binoculares', 'Guía Ornitólogo', 'Desayuno', 'Madrugada']
          }
        ];
      
      default:
        return [];
    }
  };

  const services = getServicesData();
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
        Activo
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
        Inactivo
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    if (userType === 'hotel') {
      switch (category) {
        case 'Alojamiento': return <Bed className="h-4 w-4" />;
        case 'Servicios Adicionales': return <Utensils className="h-4 w-4" />;
        case 'Transporte': return <MapPin className="h-4 w-4" />;
        default: return <Bed className="h-4 w-4" />;
      }
    } else if (userType === 'restaurante') {
      return <Utensils className="h-4 w-4" />;
    } else {
      return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Servicios</h2>
          <p className="text-sm text-gray-600">
            Administra todos los servicios disponibles
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="input-field w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  {getCategoryIcon(service.category)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.category}</p>
                </div>
              </div>
              {getStatusBadge(service.status)}
            </div>

            <p className="text-sm text-gray-600 mb-4">{service.description}</p>

            {/* Características */}
            <div className="flex flex-wrap gap-2 mb-4">
              {service.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {service.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{service.features.length - 3} más
                </span>
              )}
            </div>

            {/* Información adicional */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{service.capacity} {service.capacity === 1 ? 'persona' : 'personas'}</span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                <Eye className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="card text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer servicio'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
