import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

const STORES = [
  { name: 'Bandra West', address: '15 Turner Road, Bandra West, Mumbai — 400050', phone: '022-4012 3456', hours: 'Mon–Sun: 8 AM – 10 PM', area: 'Mumbai' },
  { name: 'Juhu', address: 'Shop 4, Sun N Sand Arcade, Juhu Tara Road, Mumbai — 400049', phone: '022-4012 3457', hours: 'Mon–Sun: 8 AM – 10 PM', area: 'Mumbai' },
  { name: 'Koramangala', address: '80 Feet Road, Koramangala 4th Block, Bengaluru — 560034', phone: '080-4012 7890', hours: 'Mon–Sun: 8 AM – 10 PM', area: 'Bengaluru' },
  { name: 'Indiranagar', address: '100 Feet Road, Indiranagar, Bengaluru — 560038', phone: '080-4012 7891', hours: 'Mon–Sun: 8 AM – 9 PM', area: 'Bengaluru' },
  { name: 'Jubilee Hills', address: 'Road No. 36, Jubilee Hills, Hyderabad — 500033', phone: '040-4012 5678', hours: 'Mon–Sun: 9 AM – 9 PM', area: 'Hyderabad' },
  { name: 'Banjara Hills', address: 'Road No. 12, Banjara Hills, Hyderabad — 500034', phone: '040-4012 5679', hours: 'Mon–Sun: 9 AM – 9 PM', area: 'Hyderabad' },
  { name: 'Alwarpet', address: '17 TTK Road, Alwarpet, Chennai — 600018', phone: '044-4012 3456', hours: 'Mon–Sun: 8 AM – 9 PM', area: 'Chennai' },
  { name: 'Nungambakkam', address: '43 Khader Nawaz Khan Road, Nungambakkam, Chennai — 600006', phone: '044-4012 3457', hours: 'Mon–Sun: 8 AM – 9 PM', area: 'Chennai' },
]

const CITIES = ['All Cities', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai']

export default function StoreLocatorPage() {
  return (
    <div className="container-custom py-10">
      <div className="text-center mb-10">
        <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Find Us</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">Store Locator</h1>
        <p className="text-gray-500 mt-2">Visit one of our {STORES.length} stores across India for a premium shopping experience.</p>
      </div>

      {/* City filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CITIES.map(city => (
          <button key={city} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${city === 'All Cities' ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700'}`}>
            {city}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="w-full h-64 bg-gradient-to-br from-brand-50 to-green-100 rounded-2xl mb-10 flex items-center justify-center border border-brand-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-brand-400 mx-auto mb-2" />
          <p className="text-brand-600 font-medium">Interactive Map</p>
          <p className="text-brand-400 text-sm">Integrate Google Maps with your API key</p>
        </div>
      </div>

      {/* Store list grouped by city */}
      {['Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai'].map(city => (
        <div key={city} className="mb-8">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-500" /> {city}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {STORES.filter(s => s.area === city).map(store => (
              <div key={store.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-200 hover:shadow-sm transition-all">
                <h3 className="font-bold text-gray-900 mb-3">Nature's Harvest — {store.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 text-brand-600 font-semibold text-sm hover:text-brand-700">
                  <Navigation className="w-4 h-4" /> Get Directions
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
