const ShowSideBar = document.querySelector('.OpenSideBar');
const HideSideBar = document.querySelector('.CloseSideBar');

ShowSideBar.addEventListener('click', () => {
    document.querySelector('.SideBar').style.transform = 'translateX(0)';
    document.body.classList.add('DisableScroll');
});

HideSideBar.addEventListener('click', () => {
     document.querySelector('.SideBar').style.transform = 'translateX(100%)';
    document.body.classList.remove('DisableScroll');
});

function LoadProducts(Conatiner)
{
    fetch('../Products/Products.json').then(res => res.json()).then(data =>{
        data.sections.forEach(section => {
            Conatiner.insertAdjacentHTML('beforeend', `<h2 class="TitleText SectionHeader">${section.name}</h2>`);

            const SectionContainer = document.createElement('div');
            SectionContainer.classList.add('SwiperContainer', 'swiper');

            const ProductsList = document.createElement('div');
            ProductsList.classList.add('Products', 'swiper-wrapper');

            section.products.forEach(product =>
            {
                const ProductCard = document.createElement('div');
                ProductCard.classList.add('Product', 'swiper-slide');
                ProductCard.setAttribute('ProductID', product.id);

                ProductCard.innerHTML = `
                    <img src="${product.image}" alt="">
                    <h2 class="ProductName">${product.name}</h2>
                    <p class="ProductShortDec">${product.shortDescription}</p>
                    <hr>
                    <p class="ProductPrice">${product.price} ريال يمني (قديم)</p>
                    <button class="BuyFromMain Btn PrimaryBtn">شراء</button>
                `;

                ProductCard.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('BuyFromMain')) {
                        window.location.href = `../Products/SingleProduct.html?id=${product.id}`;
                    }
                });
                
                const BuyBtn = ProductCard.querySelector('.BuyFromMain');
                BuyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sendAutoWhatsApp(product.name, product.plane[0].planeMethod);
                });

                ProductsList.appendChild(ProductCard);
            }
            );

            SectionContainer.appendChild(ProductsList);
            Conatiner.appendChild(SectionContainer);

            new Swiper('.SwiperContainer', {
                // loop: true,

                breakpoints: {
                    0:{
                    slidesPerView:2,
                    spaceBetween: 10
                    },
                    768:{
                    slidesPerView:3,
                    spaceBetween:20
                    },
                    1024:{
                    slidesPerView:5,
                    spaceBetween:25
                    },
                }
            });
        });
    });
}

const Conatiner = document.querySelector(".ProductsSection");
console.log(Conatiner);
if(Conatiner)
    LoadProducts(Conatiner);

function GetIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function LoadProductDetails(id)
{
    const res = await fetch('products.json');
    const data = await res.json();

    for (const sec of data.sections) {
        const product = sec.products.find(p => p.id === Number(id));
        if (product) {
            return product;
        }
    }
    return null;
}

const area = document.querySelector(".ProductContainer");
if(area)
{
    LoadProductDetails(GetIdFromUrl()).then(product => {
        if (!product) {
            area.innerHTML = "<p>المنتج غير موجود</p>";
            return;
        }

        let PlaneOptions = "";
        if (product.plane && product.plane.length > 0) {
            PlaneOptions = product.plane
                .map(p => `<option>${p.planeMethod} - ${p.price} ريال يمني</option>`)
                .join('');
        } 

        area.innerHTML = `
        <div class="ProductImgContainer">
            <img src="${product.image}" alt="" id="product-main-image">
        </div>
        <div class="SingleProduct">
                <div class="ProductBaseInfo">
                    <h2 class="SingleProductName">${product.name}</h2>
                    <p class="SingleProductPrice"> سعر اقل نوع ${product.price} ريال يمني</p>
                </div>

                <div class="SingleProductDetails">
                    <h3 class="SingleProductDescriptionTitle">الوصف</h3>
                    <p class="SingleProductDescription">${product.description}</p>
                </div>
                <div class="PriceSelectorConteiner">
                    <h3 class="PriceSelectorTitle">قم بأختيار أحد الأختيارات</h3>
                    <select name="SelectedValue" class="PriceSelector">
                            ${PlaneOptions}
                    </select>
                </div>
                <div class="ProductBtnGroup">
                    <div class="Btn PrimaryBtn BuyFromSinglePage">شراء</div>
                </div>
        </div>
        `;

        const buyBtn = area.querySelector('.BuyFromSinglePage');
        buyBtn.addEventListener('click', () => {
            const selector = area.querySelector('.PriceSelector');
            const selectedOption = selector.options[selector.selectedIndex];
            
            sendAutoWhatsApp(product.name, selectedOption.textContent);
        });
    });
};

function sendAutoWhatsApp(productName, plane) {
    const visitTime = new Date().toLocaleString('ar-SA');
    
    const message = `
استفسار عن المنتج:

اسم المنتج: ${productName}
نوع المنتج: ${plane}

هل هذا المنتج متوفر؟
${visitTime}
    `.trim();
    
    const encodedMessage = encodeURIComponent(message);
    const phone = "967730020957";
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
};
