import React from "react";

function Brand() {
  const medicalBrands = [
    {
      name: "Apollo Hospitals",
      logo: "https://www.apollohospitals.com/themes/custom/apollo/assets/svg/apollo-logo.svg",
    },
    {
      name: "Fortis Healthcare",
      logo: "https://www.fortishealthcare.com/themes/custom/fortis/logo.png",
    },

    {
      name: "AIIMS",
      logo: "https://www.aiimsexams.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.6e0ec689.png&w=384&q=75",
    },
    {
      name: "PharmEasy",
      logo: "https://assets.pharmeasy.in/apothecary/images/logo_big.svg?dim=360x0",
    },

    {
      name: "Tata 1mg",
      logo: "https://www.1mg.com/images/tata_1mg_logo.svg",
    },
  ];

  return (
    <>
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="text-3xl md:text-4xl font-bold text-center text-blue-900 m-8">
        Our Trusted Medical Partners 🏥
      </div>

      <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div
          className="marquee-inner flex will-change-transform min-w-[200%]"
          style={{ animationDuration: "15s" }}
        >
          <div className="flex">
            {[...medicalBrands, ...medicalBrands].map((brand, index) => (
              <img
                key={index}
                src={brand.logo}
                alt={brand.name}
                className="w-28 h-16 object-contain mx-6 grayscale hover:grayscale-0 transition duration-300"
                draggable={false}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </>
  );
}

export default Brand;
