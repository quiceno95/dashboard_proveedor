import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Star,
  Target,
  Activity,
  Clock,
  MapPin,
  Award,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

const StatisticsSection = ({ userType }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Datos estadísticos según el tipo de usuario
  const getStatisticsData = () => {
    const baseStats = {
      totalRevenue: 15750000,
      totalCustomers: 1247,
      averageRating: 4.6,
      conversionRate: 68.5,
      repeatCustomers: 42.3,
      peakHours: ['19:00-21:00', '12:00-14:00'],
      topServices: [
        { name: 'Suite Ejecutiva', bookings: 156, revenue: 4680000 },
        { name: 'Habitación Estándar', bookings: 289, revenue: 4335000 },
        { name: 'Spa y Wellness', bookings: 98, revenue: 784000 }
      ],
      monthlyTrends: [
        { month: 'Ene', customers: 180, revenue: 12500000, rating: 4.4 },
        { month: 'Feb', customers: 195, revenue: 14200000, rating: 4.5 },
        { month: 'Mar', customers: 220, revenue: 15800000, rating: 4.6 },
        { month: 'Abr', customers: 205, revenue: 13900000, rating: 4.5 },
        { month: 'May', customers: 235, revenue: 16200000, rating: 4.7 },
        { month: 'Jun', customers: 212, revenue: 15750000, rating: 4.6 }
      ],
      demographics: [
        { age: '18-25', percentage: 15, customers: 187 },
        { age: '26-35', percentage: 35, customers: 437 },
        { age: '36-45', percentage: 28, customers: 349 },
        { age: '46-55', percentage: 15, customers: 187 },
        { age: '56+', percentage: 7, customers: 87 }
      ],
      locations: [
        { city: 'Bogotá', customers: 423, percentage: 33.9 },
        { city: 'Medellín', customers: 312, percentage: 25.0 },
        { city: 'Cali', customers: 187, percentage: 15.0 },
        { city: 'Cartagena', customers: 156, percentage: 12.5 },
        { city: 'Otros', customers: 169, percentage: 13.6 }
      ]
    };

    // Adaptar datos según el tipo de usuario
    if (userType === 'restaurante') {
      return {
        ...baseStats,
        topServices: [
          { name: 'Menú Ejecutivo', bookings: 456, revenue: 3420000 },
          { name: 'Cena Romántica', bookings: 89, revenue: 2680000 },
          { name: 'Buffet Dominical', bookings: 234, revenue: 1872000 }
        ],
        peakHours: ['12:00-14:00', '19:00-21:00', '20:00-22:00']
      };
    } else if (userType === 'tour') {
      return {
        ...baseStats,
        topServices: [
          { name: 'City Tour Histórico', bookings: 234, revenue: 2340000 },
          { name: 'Aventura en la Montaña', bookings: 156, revenue: 3120000 },
          { name: 'Tour Gastronómico', bookings: 189, revenue: 1890000 }
        ],
        peakHours: ['09:00-11:00', '14:00-16:00', '07:00-09:00']
      };
    }

    return baseStats;
  };

  const stats = getStatisticsData();

  const getServiceIcon = () => {
    switch (userType) {
      case 'hotel':
        return '🏨';
      case 'restaurante':
        return '🍽️';
      case 'tour':
        return '🗺️';
      default:
        return '📊';
    }
  };

  const getMetricLabel = () => {
    switch (userType) {
      case 'hotel':
        return 'Estadías';
      case 'restaurante':
        return 'Reservas';
      case 'tour':
        return 'Tours';
      default:
        return 'Servicios';
    }
  };

  const formatCurrency = (amount) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const getGrowthIndicator = (current, previous) => {
    const growth = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth > 0,
      icon: growth > 0 ? TrendingUp : TrendingDown,
      color: growth > 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Estadísticas y Análisis</h2>
          <p className="text-sm text-gray-600">
            Insights detallados sobre el rendimiento del negocio
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="input-field w-auto"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.3%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalCustomers.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +0.2
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.averageRating}/5.0
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.2%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.conversionRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Tendencias mensuales */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Tendencias Mensuales</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-600">Ingresos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Clientes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Rating</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {stats.monthlyTrends.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-sm text-gray-600 font-medium">{data.month}</div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.revenue / 20000000) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.customers / 300) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {data.customers}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(data.rating / 5) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                    {data.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Servicios más populares y demografía */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {getServiceIcon()} Servicios Más Populares
          </h3>
          <div className="space-y-4">
            {stats.topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.bookings} {getMetricLabel().toLowerCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(service.revenue)}</p>
                  <p className="text-xs text-gray-500">
                    {((service.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            👥 Demografía de Clientes
          </h3>
          <div className="space-y-3">
            {stats.demographics.map((demo, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 w-12">{demo.age}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${demo.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{demo.percentage}%</span>
                  <p className="text-xs text-gray-500">{demo.customers} clientes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ubicaciones y horarios pico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📍 Clientes por Ubicación
          </h3>
          <div className="space-y-3">
            {stats.locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{location.city}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{location.customers}</span>
                  <p className="text-xs text-gray-500">{location.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            ⏰ Horarios Pico
          </h3>
          <div className="space-y-4">
            {stats.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">{hour}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Alta demanda</span>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Insights</span>
              </div>
              <p className="text-sm text-blue-800">
                {stats.repeatCustomers}% de tus clientes son recurrentes. 
                Considera programas de fidelización para aumentar la retención.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
