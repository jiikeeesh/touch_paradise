import React from 'react';
import { CheckCircle2, XCircle } from "lucide-react";

const TrekIncludesExcludes: React.FC = () => {
  const includes = [
    "International Airport- Hotel- Airport pick up and drop off by private car/Jeep/ Hiace.",
    "Meals are on a full-board basis (Breakfast, lunch, and dinner/ the main course) during the trek in the mountain.",
    "Touch Paradise's experienced, government-licensed, English-speaking trekking guide",
    "All salary, food, drinks, accommodation, transport, and insurance for the guide.",
    "All necessary papers, including the Langtang National Park permit and TIMS card (Trekking Information Management System)",
    "Trekking equipment, such as a Sleeping bag and down jacket, on request (optional)",
    "Trekking lodges (Tea House) throughout the trek",
    "All the ground transportation including from Kathmandu- Dhunche- Kathmandu",
    "All government, Local taxes/VAT, and official Expenses",
  ];

  const excludes = [
    "Nepal entry visa fees (you can easily issue the visa on arrival at Tribhuwan International Airport, Kathmandu). $25 USD for 15 days Visa.",
    "Extra accommodation and meals behind schedule (Foods and accommodations before and after the trek)",
    "All kinds of beverages coke, beers, water, etc). Additional cost by out of management control due to the landscape, weather condition, illness, change of government policies, strikes, and physical condition, etc.",
    "Personal expenses such as snacks, laundry, telephone, WIFI, hot shower, etc at tea houses on a trek.",
    "Personal trekking equipment for this trek",
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Cost Includes */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5" />
            Cost Includes
          </div>
          <ul className="space-y-4">
            {includes.map((item, index) => (
              <li key={index} className="flex gap-4 group">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Cost Excludes */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <XCircle className="w-5 h-5" />
            Cost Excludes
          </div>
          <ul className="space-y-4">
            {excludes.map((item, index) => (
              <li key={index} className="flex gap-4 group">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-110">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrekIncludesExcludes;
