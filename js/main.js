(function() {
    const elementMainNav = document.querySelector('#mainNav');
    const elementMainNavEvents = document.querySelector('#mainNavSubEvents');
    const elementeaderCarouselIndicators = document.querySelector('#headerCarousel .carousel-indicators');
    const elementHeaderCarouselInner = document.querySelector('#headerCarousel .carousel-inner');
    const elementMainContainer = document.querySelector('#mainContainer');

    fetch('./js/data.json').then(response => response.json())
        .then(data => {
            var navLinks = '';

            data.forEach((item, index) => {
                if (item.isMainAd.toUpperCase() === 'TRUE') {
                    const navLink = `<a class="nav-link" href="#sec${item.plan}">${item.navName}</a>`;
                    navLinks += navLink;
                } else {
                    const navLink = `<li><a class="dropdown-item" href="#sec${item.plan}">${item.navName}</a></li>`;
                    elementMainNavEvents.insertAdjacentHTML('beforeend', navLinks);
                }

                elementeaderCarouselIndicators.insertAdjacentHTML('beforeend', `<button type="button" data-bs-target="#headerCarousel" data-bs-slide-to="${index}" ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="${index + 1}"></button>`);
                elementHeaderCarouselInner.insertAdjacentHTML('beforeend', `<div class="carousel-item ${index === 0 ? 'active' : '' }">
                    <img src="img/${item.rootID}/${item.headerImage}">
                    <div class="carousel-caption d-block">
                        <h5>${item.name}</h5>
                        <p>${item.catchCopy}</p>
                        <a class="btn btn-primary" href="#sec${item.plan}">詳細資訊</a>
                    </div>
                </div>`);

                const mainContent = document.createElement('article');
                mainContent.classList.add(`sec-${item.plan}`);
                mainContent.innerHTML = `<a name="sec${item.plan}"></a>
                    <div class="hero-section row m-0">
                        <div class="col-12 h-100 w-100 p-0" style="position: relative;">
                            <img src="img/${item.rootID}/${item.headerImage}">
                            <div class="description row row-cols-1 w-100 h-100 d-flex align-items-center">
                                <div class="inner">
                                    <h1 class="fw-bold">${item.name}</h1>
                                    <p>活動日期：${item.session.map((session) => {
                                        return `${session.startDate}(${toChineseDate(session.startDate, true)})-${session.endDate}(${toChineseDate(session.endDate, true)}) (報名截止：${session.expirationDate}(${toChineseDate(session.expirationDate, true)}))`;
                                    }).join('<br>')}<br>活動人數：${item.quota}人
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="detail-link row m-0 mb-5 text-bg-secondary">
                        <div class="m-auto row col-12 col-lg-9 align-items-center">
                            <div class="nav col-12 col-lg-6 d-flex justify-content-center justify-content-md-start align-items-center h-100">
                                <a href="#sec${item.plan}-intro" class="h-100"><div class="inner">特色介紹</div></a>
                                <a href="#sec${item.plan}-daily-schedule" class="h-100"><div class="inner">每日行程</div></a>
                                <a href="#sec${item.plan}-attention" class="h-100"><div class="inner">注意事項</div></a>
                            </div>
                            <div class="col-12 col-lg-6 d-flex justify-content-center justify-content-md-end align-items-center h-100 p-2">
                                <div class="h-100">
                                    ${item.session.map((session, index) => {
                                        return `<a class="btn btn-primary ms-1 me-1 ${session.status.toUpperCase() === "ON_REGISTER" ? '' : 'disabled'}" href="${session.link}" target="_blank" role="button">${session.status.toUpperCase() === "ON_REGISTER" ? `現在報名【${item.navName}】第${index+1}梯` : `即將開放報名【${item.navName}】第${index+1}梯`} </a>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content row col-12 col-lg-9 m-auto">
                        <article class="row">
                            <a name="sec${item.plan}-intro"><h1 class="text-center">特色介紹</h1></a>
                            <div class="feature w-75 text-bg-secondary p-3">
                                ${markdownToHTML(item.feature)}
                            </div>
                        </article>
                        <article class="row daily-schedule">
                            <a name="sec${item.plan}-daily-schedule"></a>
                            ${item.schedule.map((daily, dailyIndex) => {
                                return `<div class="row col-12 daily mt-5">
                                    <div class="col-12 col-md-5 col-xl-4 daily-header">
                                        <div class="row w-100 p-4 text-bg-light rounded">
                                            <div class="col-12"><h3>Day ${dailyIndex + 1}</h3></div>
                                            <div class="col-12 break mt-2 mb-5"></div>
                                            <div class="col-2" title="餐點服務"><ion-icon name="pizza-outline" size="large"></ion-icon></div>
                                            <div class="col-9 offset-1">
                                                <div class="row">
                                                    <div class="col-12">早餐-${daily.breakfast}</div>
                                                    <div class="col-12">午餐-${daily.lunch}</div>
                                                    <div class="col-12">晚餐-${daily.dinner}</div>
                                                </div>
                                            </div>
                                            <div class="col-12 break mt-2 mb-5"></div>
                                            <div class="col-2" title="住宿場所"><ion-icon name="home-outline" size="large"></ion-icon></div>
                                            <div class="col-9 offset-1">
                                                <div class="row">
                                                    <div class="col-12">${daily.accommodation ? daily.accommodation : '-'}</div>
                                                </div>
                                            </div>
                                            <div class="col-12 break mt-2 mb-5"></div>
                                            <div class="col-2" title="交通工具"><ion-icon name="car-outline" size="large"></ion-icon></div>
                                            <div class="col-9 offset-1">
                                                <div class="row">
                                                    ${(() => {
                                                        if (daily.traffic != '') {
                                                            return daily.traffic.split('\n\n').map((trafic, trafficIndex) => `<div class="col-12 ${trafficIndex === 0 ? '' : 'mt-2'}">${trafic.replace('\n', '<br>')}</div>`).join('');
                                                        } else {
                                                            return `<div class="col-12">-</div>`;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-7 col-xl-8 daily-content">
                                        <h2>${daily.description}</h2>
                                        <div class="row">
                                            ${item.place.filter(place => place.date == dailyIndex + 1).map(place => {
                                                return `<div class="col-12 col-md-6 p-2">
                                                    <article class="card text-bg-secondary">
                                                        <img src="img/${item.rootID}/${place.image}" class="card-img-top w-100 rounded p-3" style="aspect-ratio:16 / 9;object-fit:cover" alt="${place.title}">
                                                        <div class="card-body">
                                                            <h5 class="card-title"><ion-icon name="location-outline"></ion-icon><span class="ps-1">${place.title}</span></h5>
                                                        </div>
                                                    </article>
                                                </div>`
                                            }).join('')}
                                        </div>
                                    </div>
                                </div>`;
                            }).join('')}
                        </article>
                        <article class="row">
                            <div class="col-12 mt-5 mb-5">
                                <a name="sec6-attention"><h1 class="text-center">注意事項</h1></a>
                                <div class="text-bg-secondary p-4 rounded mt-4">
                                    <h2>經費說明</h2>
                                    <p class="fw-bold">專案優惠價：${item.price}。</p>
                                    <p class="fw-bold">報名名額：${item.quota}</p>
                                    <blockquote class="blockquote">
                                        <p>費用包含：</p>
                                        ${markdownToHTML(item.priceInclude)}
                                    </blockquote>
                                    ${item.otherAttention != '' ? `<h2>特殊說明</h2>${markdownToHTML(item.otherAttention)}` : ''}
                                </div>
                            </div>
                        </article>
                    </div>`;
                elementMainContainer.appendChild(mainContent);
            })

            elementMainNav.insertAdjacentHTML('afterbegin', navLinks);

            if (elementMainNavEvents.children.length == 0) {
                elementMainNav.querySelector('.dropdown').style = 'display: none;';
            }
        }).then(() => {
            var preloader = document.querySelector('.preloader');
            preloader.classList.add('fade-out');
            preloader.addEventListener('animationend', () => {
                preloader.style.display = 'none';
            });
        });
})()