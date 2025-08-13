        <div className="bg-[#ffffff] min-h-[100vh] justify-items-center">
            <div className="bg-white pt-14 md:pt-17 w-full pb-2 bg-gradient-to-b from-[#1e1e1e] to-white">
                <SearchBar setFilterLoading={setFilterLoading} />
            </div>
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full pt-4 md:pt-7 max-w-[1370px] min-h-[100vh] bg-white">
                    {/* Product Top */}

                    <h1 className="flex justify-center mb-5 md:hidden text-2xl font-bold mx-2">
                        {model.title}
                    </h1>
                    <div className="mb-5 px-4 md:px-4 flex md:flex-row flex-col items-center md:items-start gap-1">
                        {/* <div className="flex flex-row md:flex-col min-w-18.5 md:max-h-[350px] overflow-x-auto space-x-2 scrollable-container">
  {model.image?.slice(0, 8).map((img, index) => (
    <div key={index} className=" p-[1px] w-17 h-17 m-0 flex-shrink-0">
      <img
        src={img}
        alt={`Thumb ${index + 1}`}
        className={`w-full h-full p-1 rounded-md border-2 cursor-pointer object-cover hover:p-1.5 hover:border-blue-500 ${
          mainImage === img
            ? "border-blue-600"
            : "border-gray-300"
        }`}
        onMouseEnter={() => setMainImage(img)}
      />
    </div>
  ))}
</div> */}
                        <div className="flex flex-row md:flex-col min-w-18.5 max-w-full md:max-h-[350px] overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-2 scrollable-container">
                            {model.image?.slice(0, 8).map((img, index) => (
                                <div
                                    key={index}
                                    className="p-[1px] w-17 h-17 flex-shrink-0"
                                >
                                    <img
                                        src={img}
                                        alt={`Thumb ${index + 1}`}
                                        className={`w-full h-full p-1 rounded-md border-2 cursor-pointer object-cover hover:p-1.5 hover:border-blue-500 ${
                                            mainImage === img
                                                ? "border-blue-600"
                                                : "border-gray-300"
                                        }`}
                                        onMouseEnter={() => setMainImage(img)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="lg:mr-8 relative w-full max-w-[400px] min-w-[300px] h-[300px] md:w-[400px] md:h-[300px] lg:ml-1 lg:w-[750px] bg-white border border-[#0000001c] rounded-sm flex items-center justify-center overflow-hidden">
                            <img
                                key={mainImage} // this will force re-render for transition
                                src={mainImage || model.image?.[0]}
                                alt="Main View"
                                className="w-full h-full px-1 object-contain opacity-0 transition-opacity duration-300 ease-in-out"
                                onLoad={(e) =>
                                    (e.currentTarget.style.opacity = 1)
                                } // fades in when loaded
                            />
                            <div
                                className={`select-none rounded-full absolute top-2 right-2
                      ${isLiked(model.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                            >
                                <LikeButton
                                    model={model}
                                    isLiked={isLiked}
                                    toggleLike={toggleLike}
                                />
                                {/* <motion.div
                                className="select-none rounded-full p-2 cursor-pointer transition-colors duration-200"
                                onClick={() => toggleLike(model)}
                                initial={false}
                                animate={
                                    isLiked(model.id)
                                        ? {
                                              scale: [1, 1.4, 0.8, 1],
                                          }
                                        : {}
                                }
                                transition={{
                                    duration: 0.45,
                                    ease: [0.04, 0.4, 0.5, 0.95],
                                }}
                            >
                                <Heart
                                    className="cursor-pointer"
                                    size={16}
                                    fill={isLiked(model.id) ? "red" : "#c4c4c4"}
                                    color={
                                        isLiked(model.id) ? "red" : "#c4c4c4"
                                    }
                                />
                            </motion.div> */}
                            </div>
                        </div>
                        <div className="w-full md:ml-4">
                            <div className="w-full space-y-4">
                                <h1 className=" hidden md:block text-2xl font-bold mb-1 ">
                                    {model.title}
                                </h1>
                                {/* <div> */}
                                <div className="flex gap-2 mt-1.5">
                                    <div className="flex max-w-[47px] items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                        <p className="flex text-xs items-center pt-[1px]">
                                            {model.rating}
                                        </p>
                                        <IoIosStar className="text-[11px] flex items-center" />
                                        {/* </div> */}
                                    </div>
                                    <p className="text-[#4a5565] text-sm">
                                        ({model.ratings} Ratings &{" "}
                                        {model.reviews} Reviews)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mb-1 ">
                                    <p className="text-3xl font-bold ">
                                        {model.price === 0
                                            ? "Free"
                                            : `₹${model.price}`}
                                    </p>
                                    {/* <div className="text-green-600 text-md flex justify-center items-center">
                                        {model.rating}
                                    </div> */}
                                </div>
                                <p className="text-gray-600 text-sm mb-1.5 mt-2">
                                    {model.description}
                                </p>
                                <p className="text-sm mb-1 text-gray-600">
                                    {model.software} | {model.category}
                                </p>
                                <p className="text-sm mb-1 text-gray-600">
                                    Format: {model.format}
                                </p>
                                <p className="text-sm ">
                                    Seller: {model.owner}
                                </p>
                            </div>
                            <div className=" bottom-0 w-full mt-5 left-0 flex gap-5 z-1">
                                <button className="bg-[#ffcb20] w-[50%] md:mr-2 lg:mr-4 rounded-full cursor-pointer md:w-full max-w-60 md:max-w-50 hover:bg-[#ffc525]  text-black px-4 py-2 ">
                                    Add to Cart
                                </button>
                                <button className="bg-[#ff8512] rounded-full cursor-pointer w-[50%] max-w-60 md:w-full md:max-w-50 hover:bg-[#ff7b00] text-black px-4 py-2 ">
                                    {model.price === 0
                                        ? "Download Now"
                                        : "Buy Now"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <div className="pb-6 bg-[#f1f3f6] ">
                            <div className="lg:px-8 px-5 bg-white custom-shadow-pdetails">
                                {/* <CustomerReviews reviews={dummyReviews} /> */}
                                <CustomerReviews
                                    reviews={model.review}
                                    modelId={model.id}
                                />
                            </div>
                        </div>

                        {/* Related Products */}

                        <div className="bg-[#f1f3f6] pb-6">
                            <div className=" bg-green-400 custom-shadow-pdetails ">
                                <RelatedProducts currentModel={model} />
                            </div>
                        </div>

                        {/* Recommended Products */}

                        <div className="bg-[#f1f3f6] pb-6">
                            <div className=" bg-green-400 custom-shadow-pdetails ">
                                <RecommendedProducts
                                    currentModelId={model.id}
                                    allModels={models}
                                />
                            </div>
                        </div>
                        {/* Recently Viewed */}

                        <div className="bg-[#f1f3f6] pb-6">
                            <div className=" bg-green-400 custom-shadow-pdetails ">
                                <div className=" bg-[#f1f3f6]">
                                    <div className="lg:px-8 px-5 w-full bg-white border-t border-gray-200 pt-7">
                                        <h2 className="text-2xl font-semibold mb-4">
                                            Recently Viewed
                                        </h2>
                                        <Swiper
                                            slidesPerView="auto"
                                            spaceBetween={15}
                                            pagination={{
                                                el: ".custom-pagination-recent",
                                                clickable: true,
                                            }}
                                            modules={[Pagination]}
                                            className="lg:max-w-full"
                                        >
                                            {recent.map((product) => (
                                                <SwiperSlide
                                                    key={product.id}
                                                    className="!w-[250px] max-w-none"
                                                >
                                                    <div className=" w-full max-w-[280px] min-w-[150px] bg-white rounded-[10px] overflow-hidden   overflow-y-hidden  border  border-[#c9c9c9]">
                                                        <img
                                                            src={
                                                                product.image[0]
                                                            }
                                                            alt={product.title}
                                                            className="w-full h-48 object-cover user-select-none"
                                                        />
                                                        <div
                                                            className={`scale-90 select-none rounded-full absolute top-2 right-2 bg-[#d61515] 
                      ${isLiked(product.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                                                        >
                                                            <LikeButton
                                                                model={product}
                                                                isLiked={
                                                                    isLiked
                                                                }
                                                                toggleLike={
                                                                    toggleLike
                                                                }
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                                <Link
                                                                    href={`/models/${product.id}`}
                                                                    className="inline-block hover:text-[#ec843f]"
                                                                >
                                                                    {
                                                                        product.title
                                                                    }
                                                                </Link>
                                                            </h3>
                                                            <div className="flex items-center text-yellow-500 text-sm mt-1">
                                                                <div className="flex gap-2 mt-1.5">
                                                                    <div className="flex max-w-[47px] items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                                                        <p className="flex text-xs items-center pt-[1px]">
                                                                            {
                                                                                product.rating
                                                                            }
                                                                        </p>
                                                                        <IoIosStar className="text-[11px] flex items-center" />
                                                                        {/* </div> */}
                                                                    </div>
                                                                    <p className="text-[#4a5565] text-sm">
                                                                        (
                                                                        {
                                                                            product.ratings
                                                                        }
                                                                        )
                                                                    </p>
                                                                </div>
                                                                {/* {Array(5)
                                                                    .fill(0)
                                                                    .map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <IoIosStar
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={
                                                                                    i <
                                                                                    product.rating
                                                                                        ? "text-yellow-500"
                                                                                        : "text-gray-300"
                                                                                }
                                                                            />
                                                                        )
                                                                    )} */}
                                                            </div>
                                                            <p className="text-black font-bold mt-2">
                                                                {product.price ===
                                                                0
                                                                    ? "Free"
                                                                    : `₹${product.price}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div className="resize-pagination-0 mt-4 pb-13 text-center">
                                            <div className="custom-pagination-recent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>