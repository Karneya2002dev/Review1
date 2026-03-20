import brand1 from "../../../assets/goodrej.jpg";
import brand2 from "../../../assets/goodrej.jpg";
import brand3 from "../../../assets/goodrej.jpg";
import brand4 from "../../../assets/goodrej.jpg";
import brand5 from "../../../assets/goodrej.jpg";
import brand6 from "../../../assets/goodrej.jpg";
import brand7 from "../../../assets/goodrej.jpg";
import brand8 from "../../../assets/goodrej.jpg";

export default function BrandsCarousel() {

  // ✅ Static brands data
  const brands = [
    { name: "Godrej", image: brand1 },
    { name: "Fogg", image: brand2 },
    { name: "Maggi", image: brand3 },
    { name: "Aashirvaad", image: brand4 },
    { name: "Tata", image: brand5 },
    { name: "Haldirams", image: brand6 },
    { name: "Parachute", image: brand7 },
    { name: "Popzo", image: brand8 },
  ];

  return (
    <div className="bg-[#f3f5f4] py-10 overflow-hidden">

      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-10">
        Brands You Love
      </h2>

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">

        <div className="flex gap-10 animate-scroll hover:[animation-play-state:paused]">

          {/* 🔥 Duplicate for infinite scroll */}
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-30"
            >

              {/* Circle */}
              <div className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border">

                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-20 h-20 object-contain"
                />
              </div>

              {/* Name */}
              <p className="mt-3 text-sm font-medium text-gray-700 text-center">
                {brand.name}
              </p>

            </div>
          ))}

        </div>

        {/* Left Fade */}
        <div className="absolute left-0 top-0 h-full w-20 bg-linear-to-r from-[#f3f5f4] to-transparent pointer-events-none"></div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#f3f5f4] to-transparent pointer-events-none"></div>

      </div>
    </div>
  );
}