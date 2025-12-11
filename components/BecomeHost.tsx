import React, { useEffect, useState } from 'react';
import Footer from './Footer';

interface BecomeHostProps {
  onBackToHome: () => void;
  onListCar: () => void;
}

const BecomeHost: React.FC<BecomeHostProps> = ({ onBackToHome, onListCar }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Slider State
  const [days, setDays] = useState(15);
  const PRICE_PER_DAY = 80;
  const totalEarnings = days * PRICE_PER_DAY;
  const progressPercent = (days / 30) * 100;

  const steps = [
    {
      icon: "fa-car",
      title: "1. Anuncie seu carro",
      desc: "Crie seu anúncio gratuitamente. Defina preço, regras e disponibilidade. Você está no comando."
    },
    {
      icon: "fa-bolt",
      title: "2. Receba reservas",
      desc: "Motoristas verificados enviam solicitações. Aceite manualmente ou ative a Reserva Instantânea."
    },
    {
      icon: "fa-key",
      title: "3. Entregue as chaves",
      desc: "Encontre o motorista no local combinado, faça a vistoria rápida no app e entregue o carro."
    },
    {
      icon: "fa-wallet",
      title: "4. Receba o pagamento",
      desc: "Seu pagamento é processado automaticamente e depositado na sua conta após o fim da viagem."
    }
  ];

  const transparencyItems = [
    "Vistoria digital do veículo (fotos de check-in/out)",
    "Verificação da CNH do motorista",
    "Chat direto com o locador antes da reserva",
    "Pagamento protegido",
    "Histórico de avaliações de motoristas"
  ];

  const renderImageCard = () => (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
      <img 
        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80" 
        alt="Interior de carro seguro" 
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-[#3667AA]/10 mix-blend-overlay"></div>
      
      {/* Floating Badge */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm text-[#222222] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <i className="fas fa-shield-alt text-xl"></i>
        </div>
        <div>
            <p className="font-bold text-sm">100% Seguro</p>
            <p className="text-xs text-[#484848]">Cobertura completa</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans animate-fade-in text-[#222222] pb-24 md:pb-0">
      
      {/* SECTION 1: HERO BANNER (WHITE BACKGROUND) */}
      <div className="relative overflow-hidden bg-white pb-12 pt-10 lg:pt-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Image Banner */}
            <div className="w-full relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] shadow-xl group">
              <img 
                src="https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&w=1600&q=80" 
                alt="Driving on sunset" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16 text-left">
                 {/* CHANGED: font-extrabold to font-medium */}
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-3 tracking-tight">
                   Ganhe com Seu Carro
                 </h1>
                 <p className="text-base sm:text-lg text-white/90 max-w-2xl font-medium">
                   Transforme seu carro em uma fonte de renda passiva com a Cubecar.
                 </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* SECTION 2: WHY LIST (GRAY BACKGROUND) */}
      <div className="py-12 md:py-20 bg-gray-50 border-y border-gray-100">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Why List Your Car Header */}
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
               {/* CHANGED: font-bold to font-medium */}
               <h2 className="text-2xl md:text-3xl font-medium text-[#222222] mb-4">Por que listar seu carro na Cubecar?</h2>
               <p className="text-[#484848] text-base md:text-lg">
                 Oferecemos as ferramentas e o suporte para que você alugue seu carro com total segurança e tranquilidade.
               </p>
            </div>

            {/* Feature Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
              
              {/* Card 1 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                    <i className="fas fa-money-bill-wave text-xl"></i>
                 </div>
                 {/* CHANGED: font-bold to font-medium */}
                 <h3 className="font-medium text-[#222222] mb-2">Renda Extra</h3>
                 <p className="text-sm text-[#484848] leading-relaxed">
                   Gere uma renda adicional para cobrir os custos do seu carro ou realizar seus sonhos.
                 </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <i className="fas fa-shield-alt text-xl"></i>
                 </div>
                 {/* CHANGED: font-bold to font-medium */}
                 <h3 className="font-medium text-[#222222] mb-2">Seguro e Suporte</h3>
                 <p className="text-sm text-[#484848] leading-relaxed">
                   Seu carro coberto por seguro completo, e nosso suporte está disponível 24/7.
                 </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                    <i className="fas fa-sliders-h text-xl"></i>
                 </div>
                 {/* CHANGED: font-bold to font-medium */}
                 <h3 className="font-medium text-[#222222] mb-2">Controle Total</h3>
                 <p className="text-sm text-[#484848] leading-relaxed">
                   Você define seu preço, disponibilidade e regras. Alugue nos seus próprios termos.
                 </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                    <i className="fas fa-user-friends text-xl"></i>
                 </div>
                 {/* CHANGED: font-bold to font-medium */}
                 <h3 className="font-medium text-[#222222] mb-2">Comunidade Confiável</h3>
                 <p className="text-sm text-[#484848] leading-relaxed">
                   Todos os locatários são verificados para garantir uma comunidade segura e respeitosa.
                 </p>
              </div>

            </div>
         </div>
      </div>

      {/* SECTION 3: SIMULATOR (WHITE BACKGROUND) */}
      <div className="py-12 md:py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full text-left mb-8">
                {/* CHANGED: font-bold to font-medium */}
                <h2 className="text-2xl md:text-3xl font-medium text-[#222222] mb-2">Quanto você pode ganhar?</h2>
                <p className="text-[#484848] text-base md:text-lg">Simule seu potencial de ganhos.</p>
            </div>

            <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 text-left">
              
              {/* LEFT: Simulator Card */}
              <div className="w-full lg:w-1/2 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-sm relative">
                
                <div className="flex justify-between items-baseline mb-8">
                   <h3 className="text-xs font-bold text-[#484848] uppercase tracking-wide">ALUGUE POR</h3>
                   <span className="text-[#3667AA] font-bold text-lg">{days} dias</span>
                </div>

                <div className="relative w-full mb-10 px-2">
                   <div className="relative h-2 bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-full bg-[#3667AA] rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-[#3667AA] border-4 border-white rounded-full shadow-md cursor-pointer"
                        style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
                      ></div>
                   </div>
                   <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      step="1"
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Selecione os dias"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-wider">
                      <span>0 dias</span>
                      <span>30 dias</span>
                    </div>
                </div>

                <div className="bg-[#eef2ff] rounded-2xl p-6 text-center border border-indigo-50">
                    <p className="text-sm text-[#3667AA] font-bold mb-1">Potencial de ganhos mensais</p>
                    <p className="text-4xl md:text-5xl font-extrabold text-[#3667AA] tracking-tight">
                      R$ {totalEarnings}
                    </p>
                </div>
                
                <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                    *Cálculo com base na diária de R$ 80
                </p>
              </div>

              {/* RIGHT: Text Content */}
              <div className="w-full lg:w-1/2">
                {/* CHANGED: font-bold to font-medium */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-[#222222] mb-6 leading-tight">
                  Seu carro parado vale mais do que parece.
                </h2>
                <p className="text-base md:text-lg text-[#484848] leading-relaxed mb-8">
                   Mesmo com uma rotina corrida, alguns dias compartilhados já podem gerar um retorno que ajuda no dia a dia, sem complicação. É só aproveitar os momentos em que ele ficaria parado para ganhar um extra de verdade.
                </p>
                
                {/* Desktop Button Only */}
                <button 
                  onClick={onListCar}
                  className="hidden md:inline-flex w-full sm:w-auto text-white bg-[#3667AA] hover:bg-[#2c528a] focus:ring-4 focus:ring-blue-200 font-bold rounded-full text-lg px-8 py-4 text-center transition-all shadow-lg shadow-blue-100 transform active:scale-[0.98] items-center justify-center gap-2"
                >
                  Anunciar grátis
                </button>
              </div>

            </div>
        </div>
      </div>

      {/* SECTION 4: STEPS (GRAY BACKGROUND) */}
      <div className="py-12 md:py-20 bg-gray-50 relative border-y border-gray-100">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 md:mb-20">
               {/* CHANGED: font-bold to font-medium */}
               <h2 className="text-2xl md:text-3xl font-medium text-[#222222]">Como funciona para você</h2>
               <p className="text-[#484848] mt-4 max-w-2xl mx-auto text-sm md:text-base">Um processo simples, transparente e seguro do início ao fim.</p>
            </div>

            <div className="relative">
               
               {/* DESKTOP CONNECTOR LINE */}
               <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-[3px] bg-[#3667AA] -z-10"></div>

               {/* MOBILE CONNECTOR LINE CONTAINER */}
               <div className="flex flex-col md:grid md:grid-cols-4 md:gap-12 relative">
                  
                  {/* Vertical Line Mobile Background */}
                  <div className="md:hidden absolute top-8 bottom-24 left-[2rem] w-[3px] bg-[#3667AA] -z-10"></div>

                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center group pb-12 md:pb-0 last:pb-0 relative">
                       
                       {/* Icon Wrapper */}
                       <div className="relative shrink-0 mr-6 md:mr-0">
                          <div className="w-16 h-16 bg-white border-4 border-[#3667AA] rounded-full flex items-center justify-center text-[#3667AA] shadow-lg md:mb-6 group-hover:scale-110 transition-transform relative z-10">
                              <i className={`fas ${step.icon} text-2xl`}></i>
                          </div>
                       </div>
                       
                       {/* Text Content (Transparent Background) */}
                       <div className="pt-1 md:pt-0 bg-transparent pr-4 md:pr-0">
                          {/* CHANGED: font-bold to font-medium */}
                          <h3 className="text-lg font-medium text-[#222222] mb-2 md:mb-3">{step.title}</h3>
                          <p className="text-sm text-[#484848] leading-relaxed">
                              {step.desc}
                          </p>
                       </div>
                    </div>
                  ))}

               </div>
            </div>
         </div>
      </div>

      {/* SECTION 5: TRANSPARENCY (WHITE BACKGROUND - Above Gray Footer) */}
      <div className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 text-[#222222] border border-gray-100">
            
            {/* Left Column: Content */}
            <div className="flex-1 relative z-10 w-full">
               <div className="inline-block bg-[#D1FAE5] text-[#065F46] rounded-full px-4 py-1.5 text-sm font-bold mb-6 shadow-sm">
                 Segurança em primeiro lugar
               </div>
               {/* CHANGED: font-bold to font-medium */}
               <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium mb-6 leading-tight">
                 Transparência em cada passo da sua reserva.
               </h2>
               <p className="text-[#484848] text-base md:text-lg mb-10 leading-relaxed">
                 Viaje com a confiança de que tudo está claro, registrado e protegido — do início ao fim.
               </p>

               {/* MOBILE IMAGE INSERTION */}
               <div className="block lg:hidden w-full relative z-10 mb-10">
                 {renderImageCard()}
               </div>

               <div className="space-y-5 mb-10">
                  {transparencyItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center shadow-sm">
                        <i className="fas fa-check text-xs text-[#059669]"></i>
                      </div>
                      <span className="text-[#484848] font-medium text-base md:text-lg">{item}</span>
                    </div>
                  ))}
               </div>

               <button 
                  onClick={onListCar}
                  className="hidden md:flex w-full sm:w-auto text-white bg-[#3667AA] hover:bg-[#2c528a] focus:ring-4 focus:ring-blue-200 font-bold rounded-full text-lg px-8 py-4 text-center transition-all shadow-lg shadow-blue-100 transform active:scale-[0.98] items-center justify-center gap-3"
                >
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <i className="fas fa-plus text-xs"></i>
                  </div>
                  Anunciar grátis
               </button>
            </div>

            {/* Right Column: Image */}
            <div className="hidden lg:block w-full lg:w-1/2 relative z-10">
                {renderImageCard()}
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 z-[60] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onListCar}
          className="w-full text-white bg-[#3667AA] hover:bg-[#2c528a] font-bold rounded-full text-lg px-5 py-4 text-center shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
             <i className="fas fa-plus text-xs"></i>
          </div>
          Anunciar grátis
        </button>
      </div>

    </div>
  );
};

export default BecomeHost;