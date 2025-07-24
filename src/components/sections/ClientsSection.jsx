import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  TrendingUp,
  Heart,
  Award
} from 'lucide-react';

const ClientsSection = ({ userType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Datos de ejemplo según el tipo de usuario
  const getClientsData = () => {
    const baseClients = [
      {
        id: 1,
        name: 'Carlos Rodríguez',
        email: 'carlos@email.com',
        phone: '+57 300 123 4567',
        location: 'Bogotá, Colombia',
        joinDate: '2023-06-15',
        totalSpent: 2500000,
        visits: 8,
        rating: 4.8,
        type: 'vip',
        lastVisit: '2024-01-10',
        preferences: ['Suite', 'Vista al mar', 'Spa'],
        notes: 'Cliente frecuente, prefiere habitaciones con vista'
      },
      {
        id: 2,
        name: 'María González',
        email: 'maria@email.com',
        phone: '+57 301 987 6543',
        location: 'Medellín, Colombia',
        joinDate: '2023-09-22',
        totalSpent: 850000,
        visits: 3,
        rating: 4.5,
        type: 'regular',
        lastVisit: '2024-01-05',
        preferences: ['Desayuno incluido', 'WiFi'],
        notes: 'Viaja por negocios, necesita facturación empresarial'
      },
      {
        id: 3,
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '+57 302 456 7890',
        location: 'Cali, Colombia',
        joinDate: '2024-01-08',
        totalSpent: 320000,
        visits: 1,
        rating: 4.2,
        type: 'new',
        lastVisit: '2024-01-08',
        preferences: ['Habitación familiar'],
        notes: 'Primera visita, familia con niños pequeños'
      },
      {
        id: 4,
        name: 'Ana Martínez',
        email: 'ana@email.com',
        phone: '+57 300 111 2222',
        location: 'Cartagena, Colombia',
        joinDate: '2022-12-10',
        totalSpent: 4200000,
        visits: 15,
        rating: 4.9,
        type: 'vip',
        lastVisit: '2024-01-12',
        preferences: ['Cena romántica', 'Mesa privada'],
        notes: 'Cliente VIP, celebra aniversarios regularmente'
      },
      {
        id: 5,
        name: 'Roberto Silva',
        email: 'roberto@email.com',
        phone: '+57 301 333 4444',
        location: 'Barranquilla, Colombia',
        joinDate: '2023-11-05',
        totalSpent: 1200000,
        visits: 6,
        rating: 4.3,
        type: 'regular',
        lastVisit: '2024-01-07',
        preferences: ['Tours de aventura', 'Actividades extremas'],
        notes: 'Le gustan las actividades de aventura y deportes extremos'
      }
    ];

    // Adaptar datos según el tipo de usuario
    return baseClients.map(client => {
      if (userType === 'restaurante') {
        return {
          ...client,
          preferences: ['Mesa junto a ventana', 'Platos vegetarianos', 'Vino tinto'],
          visits: Math.floor(client.visits * 2), // Restaurantes tienen más visitas
          notes: client.notes.replace(/habitación|suite/gi, 'mesa').replace(/hotel/gi, 'restaurante')
        };
      } else if (userType === 'tour') {
        return {
          ...client,
          preferences: ['Tours culturales', 'Fotografía', 'Grupos pequeños'],
          notes: client.notes.replace(/habitación|suite/gi, 'tour').replace(/hotel/gi, 'experiencia')
        };
      }
      return client;
    });
  };

  const clients = getClientsData();
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getClientTypeBadge = (type) => {
    switch (type) {
      case 'vip':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Award className="h-3 w-3" />
            <span>VIP</span>
          </span>
        );
      case 'regular':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <Heart className="h-3 w-3" />
            <span>Regular</span>
          </span>
        );
      case 'new':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <TrendingUp className="h-3 w-3" />
            <span>Nuevo</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVisitLabel = () => {
    switch (userType) {
      case 'hotel':
        return 'Estadías';
      case 'restaurante':
        return 'Visitas';
      case 'tour':
        return 'Tours';
      default:
        return 'Visitas';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-sm text-gray-600">
            Administra tu base de datos de clientes
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Cliente</span>
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
                placeholder="Buscar por nombre, email o ubicación..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="vip">VIP</option>
              <option value="regular">Regulares</option>
              <option value="new">Nuevos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes VIP</p>
              <p className="text-2xl font-bold text-yellow-600">
                {clients.filter(c => c.type === 'vip').length}
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos (Este mes)</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.type === 'new').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
              <p className="text-2xl font-bold text-primary">
                {(clients.reduce((sum, c) => sum + c.rating, 0) / clients.length).toFixed(1)}
              </p>
            </div>
            <Star className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Información principal */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                  {getClientTypeBadge(client.type)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{client.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Desde: {formatDate(client.joinDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>{client.rating}/5.0</span>
                  </div>
                </div>

                {/* Estadísticas del cliente */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Total Gastado</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${client.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">{getVisitLabel()}</p>
                    <p className="text-lg font-bold text-gray-900">{client.visits}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Última Visita</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(client.lastVisit)}
                    </p>
                  </div>
                </div>

                {/* Preferencias */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">Preferencias:</p>
                  <div className="flex flex-wrap gap-2">
                    {client.preferences.slice(0, 3).map((preference, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full"
                      >
                        {preference}
                      </span>
                    ))}
                    {client.preferences.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{client.preferences.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Notas */}
                {client.notes && (
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Notas:</strong> {client.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-col items-end space-y-3">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors duration-200">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="card text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los clientes aparecerán aquí'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsSection;
