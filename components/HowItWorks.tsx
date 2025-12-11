import React, { useEffect } from 'react';
import Footer from './Footer';

interface HowItWorksProps {
  onBackToHome: () => void;
  onBecomeHost: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBackToHome, onBecomeHost }) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans animate-fade-in">
      
      {/* HERO SECTION: Overlapping Card Design */}
      <div className="relative pt-8 pb-12 lg:pt-20 lg:pb-24 overflow-hidden">
        
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            
            {/* 1. Image Container (Top on Mobile, Left on Desktop) */}
            <div className="w-full lg:w-[60%] relative z-0">
              <div className="relative aspect-[4/3] lg:aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80" 
                  alt="Happy family on a road trip" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </div>

            {/* 2. Content Card (Bottom overlapping on Mobile, Right overlapping on Desktop) */}
            <div className="w-full lg:w-[45%] relative z-10 -mt-10 lg:mt-0 lg:-ml-24 px-2 lg:px-0">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
                {/* CHANGED: font-extrabold to font-medium */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-[#3667AA] mb-6 leading-tight">
                  Ter um carro <br className="hidden lg:block" />
                  só quando você <br className="hidden lg:block" />
                  quiser ter um carro
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-[#484848] leading-relaxed mb-8">
                  Encontre um carro perto de você e saia dirigindo. Use pelo tempo que precisar e devolva no final da viagem!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Steps Section - WRAPPED IN CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 md:pt-8 md:pb-24">
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
          
          <div className="text-center mb-16 max-w-2xl mx-auto px-2">
            {/* CHANGED: font-bold to font-medium */}
            <h2 className="text-2xl md:text-3xl font-medium text-[#222222] mb-4 leading-tight">
              Apenas 3 passos para alugar um carro
            </h2>
            <p className="text-sm md:text-base text-[#484848]">
              Encontre o proprietário para pegar e devolver o carro de forma rápida, simples e sem burocracia.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              {/* Icon Column */}
              <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white border-4 border-[#3667AA] rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fas fa-search-location text-3xl md:text-5xl text-[#3667AA]"></i>
                </div>
              </div>
              
              {/* Text Column */}
              <div className="w-full text-center md:text-left pt-2">
                {/* CHANGED: font-extrabold to font-medium */}
                <h3 className="text-xl md:text-2xl font-medium text-[#3667AA] mb-6">1. Antes da viagem</h3>
                
                <div className="text-[#484848] text-sm md:text-base leading-relaxed space-y-6">
                  <p>
                    Busque um carro perto de você informando localização, data e hora. Mostramos os veículos disponíveis na sua região, simples assim.
                  </p>
                  <p>
                    Depois, escolha o carro, confira o preço total e envie o pedido de reserva ao proprietário. Assim que ele confirmar, sua viagem estará garantida.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              {/* Icon Column */}
              <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white border-4 border-[#3667AA] rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fas fa-car-side text-3xl md:text-5xl text-[#3667AA]"></i>
                </div>
              </div>

              {/* Text Column */}
              <div className="w-full text-center md:text-left pt-2">
                {/* CHANGED: font-extrabold to font-medium */}
                <h3 className="text-xl md:text-2xl font-medium text-[#3667AA] mb-6">2. Durante a viagem</h3>
                
                <div className="text-[#484848] text-sm md:text-base leading-relaxed space-y-6">
                  <p>
                    No horário combinado, encontre o proprietário para pegar as chaves e fazer uma checagem rápida do carro. Tudo direto entre vocês.
                  </p>
                  <p>
                    Depois disso, é só seguir viagem com tranquilidade. Toda a comunicação e detalhes da reserva ficam disponíveis no app.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
              {/* Icon Column */}
              <div className="w-full md:w-auto flex justify-center md:justify-start shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white border-4 border-[#3667AA] rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <i className="fas fa-key text-3xl md:text-5xl text-[#3667AA]"></i>
                </div>
              </div>

              {/* Text Column */}
              <div className="w-full text-center md:text-left pt-2">
                {/* CHANGED: font-extrabold to font-medium */}
                <h3 className="text-xl md:text-2xl font-medium text-[#3667AA] mb-6">3. Após a viagem</h3>
                
                <div className="text-[#484848] text-sm md:text-base leading-relaxed space-y-6">
                  <p>
                    Retorne ao local combinado e devolva o carro diretamente ao proprietário, realizando juntos a checagem final como, combustível e estado geral.
                  </p>
                  <p>
                    Finalize a reserva no app e pronto. Sua viagem será encerrada em poucos toques.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom CTA Cards */}
      <div className="bg-white pb-12 md:pb-20 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* Dark Blue Card */}
            <div className="bg-[#0f172a] rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 text-white relative overflow-hidden text-center md:text-left">
               {/* Background pattern */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
               
               <div className="flex-1 relative z-10">
                 {/* CHANGED: font-bold to font-medium */}
                 <h3 className="text-2xl md:text-3xl font-medium mb-3 md:mb-4">Quer alugar seu carro?</h3>
                 <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8">Transforme seu veículo depreciativo em um ativo gerador de renda. Seguro e fácil.</p>
                 <button 
                  onClick={onBecomeHost}
                  className="w-full md:w-auto bg-[#3667AA] hover:bg-[#2c528a] text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                   Começar agora <i className="fas fa-arrow-right"></i>
                 </button>
               </div>
               <div className="w-full md:w-48 h-48 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-gray-700 shrink-0">
                  <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Car host" />
               </div>
            </div>

            {/* White Card */}
            <div className="bg-white rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 border border-gray-200 shadow-sm text-center md:text-left">
               <div className="flex-1 order-2 md:order-1">
                 {/* CHANGED: font-bold to font-medium */}
                 <h3 className="text-2xl md:text-3xl font-medium text-[#222222] mb-3 md:mb-4">Ainda tem dúvidas?</h3>
                 <p className="text-[#484848] text-sm md:text-base mb-6 md:mb-8">Nossa equipe de suporte está disponível para ajudar você em cada etapa do caminho.</p>
                 <button className="w-full md:w-auto border-2 border-[#3667AA] text-[#3667AA] hover:bg-blue-50 font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2">
                   Consulte nossa Central <i className="fas fa-arrow-right"></i>
                 </button>
               </div>
               <div className="relative order-1 md:order-2">
                  {/* Simple illustration composition */}
                  <div className="w-32 h-32 md:w-40 md:h-40">
                    <img src="https://cdn-icons-png.flaticon.com/512/4233/4233830.png" alt="Support" className="w-full h-full opacity-80" />
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;