'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, TrendingUp, DollarSign, MessageCircle, Play } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const services = [
  {
    title: 'AI SEO',
    desc: 'Optimize content for top Google rankings',
    color: 'from-blue-500 to-indigo-600',
    icon: Search,
    path: '/modules/ai/seo'
  },
  {
    title: 'AI Marketing',
    desc: 'Viral ads, emails, social copy that converts',
    color: 'from-emerald-500 to-teal-600',
    icon: TrendingUp,
    path: '/modules/ai/marketing'
  },
  {
    title: 'AI Sales Copy',
    desc: 'Sales pages & emails with proven psychology',
    color: 'from-orange-500 to-red-600',
    icon: DollarSign,
    path: '/modules/ai/sales'
  },
  {
    title: 'AI Chat',
    desc: '24/7 business assistant & content generator',
    color: 'from-purple-500 to-pink-600',
    icon: MessageCircle,
    path: '/modules/ai'
  }
];

export function ServicesSlider() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            AI Services That Drive Results
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Professional AI tools built for your business growth
          </p>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={32}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
          navigation={{
            nextEl: '.services-next',
            prevEl: '.services-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          grabCursor={true}
          className="services-swiper"
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 24
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 32
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32
            },
            1280: {
              slidesPerView: 3.2,
              spaceBetween: 40
            }
          }}
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="group cursor-pointer h-full">
                <Link href={service.path} className="block h-full">
                  <div className="h-[400px] bg-gradient-to-br rounded-3xl p-10 flex flex-col items-center justify-center text-center group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm hover:border-blue-200/50">
                    <div className="w-28 h-28 bg-gradient-to-br from-white/20 to-transparent rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/30 shadow-xl group-hover:rotate-12 transition-all duration-700">
                      <service.icon className="h-16 w-16 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xl text-white/90 mb-8 max-w-md leading-relaxed drop-shadow-md">
                      {service.desc}
                    </p>
                    <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                      Start Now
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center mt-16">
          <button className="services-prev w-14 h-14 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:shadow-2xl transition-all duration-300">
            <span className="sr-only">Previous</span>
            <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="services-next w-14 h-14 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:shadow-2xl transition-all duration-300">
            <span className="sr-only">Next</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

