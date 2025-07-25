import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Image, 
  DollarSign, 
  MapPin, 
  Star,
  Users,
  Clock,
  ChefHat,
  Utensils
} from 'lucide-react';
import servicesService from '../../services/servicesService';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import CreateRestaurantServiceModal from '../modals/CreateRestaurantServiceModal';
import EditRestaurantServiceModal from '../modals/EditRestaurantServiceModal';
import ViewRestaurantServiceModal from '../modals/ViewRestaurantServiceModal';

const RestaurantServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Obtener datos del usuario actual
  useEffect(() => {
    const token = Cookies.get('access_token');
    console.log('🔍 Token encontrado:', !!token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('🔍 Token decodificado:', decoded);
        setCurrentUser(decoded);
        console.log('🚀 Iniciando carga de servicios para ID:', decoded.id);
      } catch (error) {
        console.error('❌ Error al decodificar token:', error);
        setError('Error al obtener información del usuario');
      }
    } else {
      console.log('❌ No se encontró token');
      setError('No se encontró token de autenticación');
    }
  }, []);

  // Cargar servicios cuando se obtiene el usuario
  useEffect(() => {
    if (currentUser?.id) {
      loadServices();
    }
  }, [currentUser]);

  // Cargar servicios del restaurante
  const loadServices = async () => {
    if (!currentUser?.id) {
      console.log('❌ loadServices: currentUser.id no disponible');
      return;
    }
    
    console.log('🔄 Cargando servicios para restaurante ID:', currentUser.id);
    
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Haciendo petición a API de servicios...');
      const response = await servicesService.listarServiciosPorProveedor(currentUser.id);
      console.log('✅ Respuesta de API servicios:', response);
      
      // Filtrar solo servicios de tipo restaurante
      const restaurantServices = response.servicios?.filter(service => 
        service.tipo_servicio === 'restaurante'
      ) || [];
      
      setServices(restaurantServices);
    } catch (error) {
      console.error('❌ Error al cargar servicios:', error);
      console.error('❌ Error detalles:', error.response?.data || error.message);
      setError('Error al cargar los servicios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar servicios
  const filteredServices = services.filter(service => {
    const matchesSearch = service.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || 
                         (filterStatus === 'activo' && service.activo) ||
                         (filterStatus === 'inactivo' && !service.activo);
    return matchesSearch && matchesStatus;
  });

  // Ver detalles del servicio
  const handleViewService = async (serviceId) => {
    console.log('👁️ handleViewService llamado con ID:', serviceId);
    try {
      console.log('👁️ Consultando servicio...');
      const serviceData = await servicesService.consultarServicio(serviceId);
      console.log('👁️ Datos del servicio obtenidos:', serviceData);
      setSelectedService(serviceData);
      setShowViewModal(true);
      console.log('👁️ Modal de visualización activado');
    } catch (error) {
      console.error('👁️ Error al cargar servicio:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la información del servicio',
        icon: 'error',
        confirmButtonColor: '#263DBF'
      });
    }
  };

  // Editar servicio
  const handleEditService = async (serviceId) => {
    try {
      const serviceData = await servicesService.consultarServicio(serviceId);
      setSelectedService(serviceData);
      setShowEditModal(true);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la información del servicio',
        icon: 'error',
        confirmButtonColor: '#263DBF'
      });
    }
  };

  // Eliminar servicio
  const handleDeleteService = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el servicio "${serviceName}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await servicesService.eliminarServicio(serviceId);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El servicio ha sido eliminado exitosamente',
          icon: 'success',
          confirmButtonColor: '#263DBF'
        });
        loadServices(); // Recargar la lista
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el servicio. Por favor, intenta de nuevo.',
          icon: 'error',
          confirmButtonColor: '#263DBF'
        });
      }
    }
  };

  // Ver fotos del servicio
  const handleViewPhotos = (serviceId) => {
    // TODO: Implementar modal de fotos
    Swal.fire({
      title: 'Próximamente',
      text: 'La funcionalidad de fotos estará disponible pronto',
      icon: 'info',
      confirmButtonColor: '#263DBF'
    });
  };

  // Formatear precio
  const formatPrice = (price, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  // Estadísticas rápidas
  const stats = {
    total: services.length,
    activos: services.filter(s => s.activo).length,
    promedioPrecio: services.length > 0 ? 
      Math.round(services.reduce((sum, s) => sum + s.precio, 0) / services.length) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={loadServices}
          className="btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Servicios del Restaurante</h2>
            <p className="text-gray-600">Gestiona los servicios gastronómicos de tu restaurante</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="todos">Todos los servicios</option>
              <option value="activo">Solo activos</option>
              <option value="inactivo">Solo inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de servicios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relevancia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <ChefHat className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg">No hay servicios disponibles</p>
                      <p className="text-gray-400">Crea tu primer servicio gastronómico</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id_servicio} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
                            <ChefHat className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.nombre}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {service.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(service.precio, service.moneda)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.ciudad}, {service.departamento}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.relevancia === 'ALTA' ? 'bg-red-100 text-red-800' :
                        service.relevancia === 'MEDIA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {service.relevancia}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewService(service.id_servicio)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver servicio"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditService(service.id_servicio)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="Editar servicio"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewPhotos(service.id_servicio)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Ver fotos"
                        >
                          <Image className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id_servicio, service.nombre)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Eliminar servicio"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Utensils className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(stats.promedioPrecio)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de creación de servicio */}
      <CreateRestaurantServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onServiceCreated={loadServices}
      />

      {/* Modal de edición de servicio */}
      <EditRestaurantServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onServiceUpdated={loadServices}
        service={selectedService}
      />

      {/* Modal de visualización de servicio */}
      <ViewRestaurantServiceModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        service={selectedService}
      />
    </div>
  );
};

export default RestaurantServicesSection;
