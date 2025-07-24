import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Filter,
  Search,
  Plus
} from 'lucide-react';

const ReservationsSection = ({ userType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Datos de ejemplo según el tipo de usuario
  const getReservationsData = () => {
    switch (userType) {
      case 'hotel':
        return [
          {
            id: 1,
            guestName: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            phone: '+57 300 123 4567',
            service: 'Suite Ejecutiva',
            checkIn: '2024-01-15',
            checkOut: '2024-01-18',
            guests: 2,
            status: 'confirmed',
            totalAmount: 900000,
            specialRequests: 'Cama extra para niño'
          },
          {
            id: 2,
            guestName: 'María González',
            email: 'maria@email.com',
            phone: '+57 301 987 6543',
            service: 'Habitación Estándar',
            checkIn: '2024-01-16',
            checkOut: '2024-01-17',
            guests: 1,
            status: 'pending',
            totalAmount: 150000,
            specialRequests: 'Habitación no fumadores'
          },
          {
            id: 3,
            guestName: 'Juan Pérez',
            email: 'juan@email.com',
            phone: '+57 302 456 7890',
            service: 'Suite Ejecutiva',
            checkIn: '2024-01-14',
            checkOut: '2024-01-16',
            guests: 3,
            status: 'cancelled',
            totalAmount: 600000,
            specialRequests: 'Vista al mar'
          }
        ];
      
      case 'restaurante':
        return [
          {
            id: 1,
            guestName: 'Ana Martínez',
            email: 'ana@email.com',
            phone: '+57 300 111 2222',
            service: 'Cena Romántica',
            checkIn: '2024-01-15',
            checkOut: '2024-01-15',
            guests: 2,
            status: 'confirmed',
            totalAmount: 120000,
            specialRequests: 'Mesa junto a la ventana',
            time: '19:30'
          },
          {
            id: 2,
            guestName: 'Roberto Silva',
            email: 'roberto@email.com',
            phone: '+57 301 333 4444',
            service: 'Menú Ejecutivo',
            checkIn: '2024-01-16',
            checkOut: '2024-01-16',
            guests: 4,
            status: 'pending',
            totalAmount: 140000,
            specialRequests: 'Sin gluten',
            time: '13:00'
          },
          {
            id: 3,
            guestName: 'Laura Jiménez',
            email: 'laura@email.com',
            phone: '+57 302 555 6666',
            service: 'Buffet Dominical',
            checkIn: '2024-01-14',
            checkOut: '2024-01-14',
            guests: 6,
            status: 'completed',
            totalAmount: 270000,
            specialRequests: 'Mesa para niños',
            time: '12:00'
          }
        ];
      
      case 'tour':
        return [
          {
            id: 1,
            guestName: 'Diego Morales',
            email: 'diego@email.com',
            phone: '+57 300 777 8888',
            service: 'City Tour Histórico',
            checkIn: '2024-01-15',
            checkOut: '2024-01-15',
            guests: 5,
            status: 'confirmed',
            totalAmount: 300000,
            specialRequests: 'Guía en inglés',
            time: '09:00'
          },
          {
            id: 2,
            guestName: 'Carmen López',
            email: 'carmen@email.com',
            phone: '+57 301 999 0000',
            service: 'Aventura en la Montaña',
            checkIn: '2024-01-16',
            checkOut: '2024-01-16',
            guests: 3,
            status: 'pending',
            totalAmount: 360000,
            specialRequests: 'Nivel principiante',
            time: '07:00'
          },
          {
            id: 3,
            guestName: 'Fernando Castro',
            email: 'fernando@email.com',
            phone: '+57 302 111 2222',
            service: 'Tour Gastronómico',
            checkIn: '2024-01-14',
            checkOut: '2024-01-14',
            guests: 8,
            status: 'completed',
            totalAmount: 640000,
            specialRequests: 'Vegetariano',
            time: '15:00'
          }
        ];
      
      default:
        return [];
    }
  };

  const reservations = getReservationsData();
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesDate = !selectedDate || reservation.checkIn === selectedDate;
    return matchesSearch && matchesFilter && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3" />
            <span>Confirmada</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <AlertCircle className="h-3 w-3" />
            <span>Pendiente</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle className="h-3 w-3" />
            <span>Cancelada</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3" />
            <span>Completada</span>
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

  const getDateLabel = () => {
    switch (userType) {
      case 'hotel':
        return 'Check-in';
      case 'restaurante':
        return 'Fecha';
      case 'tour':
        return 'Fecha del Tour';
      default:
        return 'Fecha';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Reservas</h2>
          <p className="text-sm text-gray-600">
            Administra todas las reservas y solicitudes
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Reserva</span>
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o servicio..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="input-field w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
              <option value="completed">Completadas</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              className="input-field w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservas</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmadas</p>
              <p className="text-2xl font-bold text-green-600">
                {reservations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reservations.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-primary">
                ${reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Información principal */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{reservation.guestName}</h3>
                    <p className="text-sm text-gray-600">{reservation.service}</p>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{getDateLabel()}: {formatDate(reservation.checkIn)}</span>
                  </div>
                  
                  {reservation.time && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{reservation.time}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{reservation.phone}</span>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Solicitudes especiales:</strong> {reservation.specialRequests}
                    </p>
                  </div>
                )}
              </div>

              {/* Acciones y precio */}
              <div className="flex flex-col items-end space-y-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${reservation.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                
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

      {filteredReservations.length === 0 && (
        <div className="card text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron reservas
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedDate ? 'Intenta ajustar los filtros de búsqueda' : 'Las reservas aparecerán aquí'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReservationsSection;
