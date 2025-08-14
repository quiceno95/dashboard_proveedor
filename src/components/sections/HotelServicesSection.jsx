import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  Bed,
  UtensilsCrossed,
  DollarSign,
  Image,
  Loader,
  AlertCircle
} from 'lucide-react';
import servicesService from '../../services/servicesService';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import CreateServiceModal from '../modals/CreateServiceModal';
import EditServiceModal from '../modals/EditServiceModal';
import ViewServiceModal from '../modals/ViewServiceModal';
import PhotoUploadModal from '../modals/PhotoUploadModal';

const HotelServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoServiceId, setPhotoServiceId] = useState(null);

  // Obtener datos del usuario actual
  useEffect(() => {
    const token = Cookies.get('access_token');
    console.log('🔍 Token encontrado:', !!token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('🔍 Token decodificado:', decoded);
        setCurrentUser(decoded);
      } catch (error) {
        console.error('❌ Error al decodificar token:', error);
      }
    }
  }, []);

  // Cargar servicios del proveedor
  useEffect(() => {
    console.log('🔍 useEffect servicios - currentUser:', currentUser);
    console.log('🔍 useEffect servicios - currentUser.id:', currentUser?.id);
    if (currentUser?.id) {
      console.log('🚀 Iniciando carga de servicios para ID:', currentUser.id);
      loadServices();
    } else {
      console.log('⚠️ No se puede cargar servicios - currentUser.id no disponible');
    }
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadServices = async () => {
    if (!currentUser?.id) {
      console.log('❌ loadServices: currentUser.id no disponible');
      return;
    }
    
    console.log('🔄 Cargando servicios para proveedor ID:', currentUser.id);
    
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Haciendo petición a API de servicios...');
      const response = await servicesService.listarServiciosPorProveedor(currentUser.id);
      console.log('✅ Respuesta de API servicios:', response);
      setServices(response.servicios || []);
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
    const matchesType = filterType === 'todos' || service.tipo_servicio?.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
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

  // Ver / agregar fotos del servicio
  const handleViewPhotos = (serviceId) => {
    setPhotoServiceId(serviceId);
    setShowPhotoModal(true);
  };

  // Eliminar servicio
  const handleDeleteService = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: '¿Eliminar servicio?',
      text: `¿Estás seguro de que deseas eliminar "${serviceName}"? Esta acción no se puede deshacer.`,
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
        await loadServices();
        Swal.fire({
          title: 'Eliminado',
          text: 'El servicio ha sido eliminado exitosamente',
          icon: 'success',
          confirmButtonColor: '#263DBF'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el servicio',
          icon: 'error',
          confirmButtonColor: '#263DBF'
        });
      }
    }
  };

  const getIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'alojamiento':
        return <Bed className="h-4 w-4" />;
      case 'spa':
      case 'restaurante':
        return <UtensilsCrossed className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const formatPrice = (price, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar servicios</h3>
        <p className="text-gray-600 mb-4">{error}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Servicios del Hotel</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona todos los servicios de tu hotel
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input text-sm"
            >
              <option value="todos">Todos los tipos</option>
              <option value="alojamiento">Alojamiento</option>
              <option value="spa">Spa</option>
              <option value="restaurante">Restaurante</option>
              <option value="eventos">Eventos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id_servicio} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                        {getIcon(service.tipo_servicio)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{service.nombre}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{service.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {service.tipo_servicio}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(service.precio, service.moneda)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.ciudad}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewService(service.id_servicio)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleViewPhotos(service.id_servicio)}
                        className="text-purple-600 hover:text-purple-900 transition-colors duration-200"
                        title="Ver fotos"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditService(service.id_servicio)}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id_servicio, service.nombre)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron servicios</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'todos' || filterType !== 'todos'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer servicio'}
            </p>
            {!searchTerm && filterStatus === 'todos' && filterType === 'todos' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primer servicio
              </button>
            )}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
              <Star className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {services.filter(s => s.activo).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(Math.round(services.reduce((acc, s) => acc + s.precio, 0) / services.length || 0))}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de creación de servicio */}
      <CreateServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onServiceCreated={loadServices}
      />

      {/* Modal de edición de servicio */}
      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onServiceUpdated={loadServices}
        service={selectedService}
      />

      {/* Modal de visualización de servicio */}
      <ViewServiceModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        service={selectedService}
      />

      {/* Modal de fotos del servicio */}
      <PhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        serviceId={photoServiceId}
        onCreated={loadServices}
      />
    </div>
  );
};

export default HotelServicesSection;
