
import React, { useState, useMemo } from 'react';
import { Pet, Service, Employee, Appointment, PetSize, AppointmentStatus } from '../types';
import { PawIcon, ArrowLeftIcon, CalendarIcon } from '../components/icons';

interface ClientDashboardProps {
  onLogout: () => void;
}

// Mock Data
const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Somente Banho', description: 'Um banho refrescante para seu pet.', prices: { [PetSize.PEQUENO]: 30, [PetSize.MEDIO]: 40, [PetSize.GRANDE]: 50 } },
  { id: '2', name: 'Somente Tosa', description: 'Tosa higiênica ou na tesoura.', prices: { [PetSize.PEQUENO]: 35, [PetSize.MEDIO]: 45, [PetSize.GRANDE]: 55 } },
  { id: '3', name: 'Banho e Tosa', description: 'O pacote completo de beleza.', prices: { [PetSize.PEQUENO]: 60, [PetSize.MEDIO]: 75, [PetSize.GRANDE]: 90 } },
];

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Juliana', position: 'Banhista', workingHours: '09:00 - 18:00' },
  { id: '2', name: 'Ricardo', position: 'Tosador', workingHours: '09:00 - 18:00' },
  { id: '3', name: 'Ambos', position: 'Banhista e Tosador', workingHours: '09:00 - 18:00' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: '1', clientId: '1', petId: '1', serviceId: '3', dateTime: new Date('2024-07-28T10:00:00'), status: AppointmentStatus.CONCLUIDO, taxiDog: false, paymentMethod: 'Pix', totalPrice: 60, employeeId: '1'},
    { id: '2', clientId: '1', petId: '1', serviceId: '1', dateTime: new Date('2024-08-15T14:30:00'), status: AppointmentStatus.AGENDADO, taxiDog: true, paymentMethod: 'Na Loja', totalPrice: 40, employeeId: '2' },
];

const TAXI_DOG_PRICE = 15;

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('agendar'); // 'agendar', 'historico'
  const [pet, setPet] = useState<Pet | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  const handleRegisterPet = (newPet: Pet) => {
    setPet(newPet);
  };
  
  const addAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
    setActivePage('historico');
  };

  const PageContent = () => {
    if (!pet) {
      return <PetRegistrationForm onRegister={handleRegisterPet} />;
    }
    switch (activePage) {
      case 'agendar':
        return <BookingForm pet={pet} addAppointment={addAppointment} />;
      case 'historico':
        return <HistoryScreen appointments={appointments} />;
      default:
        return <BookingForm pet={pet} addAppointment={addAppointment}/>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-white p-6 border-r border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 text-sky-500">
            <PawIcon className="w-8 h-8"/>
            <span className="text-2xl font-bold">PetFlow</span>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <button onClick={() => setActivePage('agendar')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activePage === 'agendar' ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>
                <CalendarIcon className="w-5 h-5" /> Agendar Serviço
              </button>
            </li>
            <li className="mt-2">
              <button onClick={() => setActivePage('historico')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activePage === 'historico' ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Histórico
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-200">
             <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                <ArrowLeftIcon className="w-5 h-5"/> Sair
              </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PageContent />
      </main>
    </div>
  );
};


const PetRegistrationForm: React.FC<{ onRegister: (pet: Pet) => void }> = ({ onRegister }) => {
    const [petName, setPetName] = useState('');
    const [breed, setBreed] = useState('');
    const [weight, setWeight] = useState('');
    const [size, setSize] = useState<PetSize>(PetSize.PEQUENO);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({
            id: '1',
            name: petName,
            breed,
            weight: parseFloat(weight),
            size,
            observations: ''
        });
    }

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastre seu Pet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Pet</label>
                    <input type="text" value={petName} onChange={e => setPetName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Raça</label>
                    <input type="text" value={breed} onChange={e => setBreed(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Porte</label>
                    <select value={size} onChange={e => setSize(e.target.value as PetSize)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500">
                        {Object.values(PetSize).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button type="submit" className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors">Cadastrar</button>
            </form>
        </div>
    );
}

const BookingForm: React.FC<{ pet: Pet, addAppointment: (app: Appointment) => void }> = ({ pet, addAppointment }) => {
    const [step, setStep] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [useTaxiDog, setUseTaxiDog] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Na Loja'>('Pix');
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const selectedService = useMemo(() => MOCK_SERVICES.find(s => s.id === selectedServiceId), [selectedServiceId]);
    const totalPrice = useMemo(() => {
        if (!selectedService) return 0;
        const servicePrice = selectedService.prices[pet.size] || 0;
        const taxiPrice = useTaxiDog ? TAXI_DOG_PRICE : 0;
        return servicePrice + taxiPrice;
    }, [selectedService, useTaxiDog, pet.size]);

    const handleConfirm = () => {
        if (!selectedServiceId || !dateTime) return;
        const newAppointment: Appointment = {
            id: String(Date.now()),
            clientId: '1',
            petId: pet.id,
            serviceId: selectedServiceId,
            employeeId: selectedEmployeeId ?? undefined,
            dateTime: new Date(dateTime),
            status: AppointmentStatus.AGENDADO,
            taxiDog: useTaxiDog,
            paymentMethod,
            totalPrice
        };
        addAppointment(newAppointment);
        setShowConfirmation(true);
    }
    
    const whatsAppMessage = useMemo(() => {
      const date = new Date(dateTime);
      const formattedDate = date.toLocaleDateString('pt-BR');
      const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const message = `Olá! Gostaria de confirmar um agendamento pelo PetFlow:
Pet: ${pet.name}
Serviço: ${selectedService?.name}
Data: ${formattedDate}
Hora: ${formattedTime}
Profissional: ${MOCK_EMPLOYEES.find(e => e.id === selectedEmployeeId)?.name || 'Qualquer um'}
Táxi Dog: ${useTaxiDog ? 'Sim' : 'Não'}
Pagamento: ${paymentMethod}
Total: R$${totalPrice.toFixed(2)}`;
      return encodeURIComponent(message);
    }, [pet.name, selectedService, dateTime, selectedEmployeeId, useTaxiDog, paymentMethod, totalPrice]);

    if(showConfirmation){
      return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-2xl font-bold mt-4">Agendamento Confirmado!</h2>
            <p className="text-gray-600 mt-2">Seu horário para {pet.name} foi agendado com sucesso.</p>
            <div className="mt-6 text-left bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Serviço:</strong> {selectedService?.name}</p>
                <p><strong>Data:</strong> {new Date(dateTime).toLocaleString('pt-BR')}</p>
                <p><strong>Total:</strong> R${totalPrice.toFixed(2)}</p>
            </div>
            <a href={`https://wa.me/5511999999999?text=${whatsAppMessage}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                Enviar via WhatsApp
            </a>
            <button onClick={() => setShowConfirmation(false)} className="mt-2 text-sm text-gray-600 hover:underline">Fazer novo agendamento</button>
        </div>
      );
    }

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800">Novo Agendamento para {pet.name}</h1>
            <p className="text-gray-500 mt-1">Siga os passos para agendar um serviço.</p>
            <div className="mt-8 space-y-8">
                {/* Step 1: Service */}
                <div>
                    <h2 className="text-xl font-semibold">1. Escolha o serviço</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {MOCK_SERVICES.map(service => (
                            <button key={service.id} onClick={() => setSelectedServiceId(service.id)} className={`p-4 rounded-lg text-left border-2 transition-all ${selectedServiceId === service.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'}`}>
                                <h3 className="font-bold">{service.name}</h3>
                                <p className="text-sm text-gray-600">R$ {service.prices[pet.size].toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Details */}
                {selectedServiceId && (
                <div>
                    <h2 className="text-xl font-semibold">2. Detalhes do agendamento</h2>
                    <div className="mt-4 space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Profissional (opcional)</label>
                            <select onChange={e => setSelectedEmployeeId(e.target.value)} defaultValue="" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500">
                                <option value="">Qualquer um</option>
                                {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Data e Hora</label>
                            <input type="datetime-local" onChange={e => setDateTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div className="flex items-center">
                            <input id="taxidog" type="checkbox" checked={useTaxiDog} onChange={e => setUseTaxiDog(e.target.checked)} className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" />
                            <label htmlFor="taxidog" className="ml-2 block text-sm text-gray-900">Adicionar Táxi Dog (+R$ {TAXI_DOG_PRICE.toFixed(2)})</label>
                        </div>
                    </div>
                </div>
                )}

                {/* Step 3: Payment */}
                {dateTime && (
                <div>
                    <h2 className="text-xl font-semibold">3. Pagamento</h2>
                     <div className="mt-4 flex gap-4">
                        <button onClick={() => setPaymentMethod('Pix')} className={`flex-1 p-4 rounded-lg border-2 ${paymentMethod === 'Pix' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}>
                            <h3 className="font-bold">Pix</h3>
                            <p className="text-sm text-gray-500">Pague agora com QR Code</p>
                        </button>
                        <button onClick={() => setPaymentMethod('Na Loja')} className={`flex-1 p-4 rounded-lg border-2 ${paymentMethod === 'Na Loja' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}>
                           <h3 className="font-bold">Pagar na loja</h3>
                           <p className="text-sm text-gray-500">Pague no dia do serviço</p>
                        </button>
                    </div>
                    {paymentMethod === 'Pix' && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=chave-pix-aleatoria-petflow" alt="QR Code Pix" className="mx-auto" />
                            <p className="mt-2 text-sm font-mono break-all">chave-pix-aleatoria-petflow</p>
                        </div>
                    )}
                </div>
                )}

                {/* Summary & Confirm */}
                {totalPrice > 0 && dateTime && (
                    <div className="mt-8 pt-6 border-t">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total:</span>
                            <span>R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button onClick={handleConfirm} className="mt-4 w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                            Confirmar Agendamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const HistoryScreen: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const getStatusChip = (status: AppointmentStatus) => {
        switch(status) {
            case AppointmentStatus.AGENDADO: return 'bg-blue-100 text-blue-800';
            case AppointmentStatus.CONFIRMADO: return 'bg-yellow-100 text-yellow-800';
            case AppointmentStatus.CONCLUIDO: return 'bg-green-100 text-green-800';
            case AppointmentStatus.CANCELADO: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
         <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Histórico de Agendamentos</h1>
            <div className="space-y-4">
                {appointments.length > 0 ? appointments.sort((a,b) => b.dateTime.getTime() - a.dateTime.getTime()).map(app => {
                    const service = MOCK_SERVICES.find(s => s.id === app.serviceId);
                    return (
                        <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{service?.name}</h3>
                                <p className="text-gray-600">{new Date(app.dateTime).toLocaleString('pt-BR')}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChip(app.status)}`}>{app.status}</span>
                                  {app.taxiDog && <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">Táxi Dog</span>}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">R$ {app.totalPrice.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{app.paymentMethod}</p>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-center text-gray-500 py-10">Nenhum agendamento encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
