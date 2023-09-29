const targetUrl = 'https://cms.cnpg.co.nz'

const getPostsList = () => {
    let yearOptionsElement = document.querySelector('#filter2')
    let homeEventsElement = document.querySelector('#events')
    let events = []
    let yearsObj = {}
    let homeObj = {}
    fetch('\n' +
        `${targetUrl}/api/articles?pagination[limit]=99999&pagination[start]=0&pagination[withCount]=true&populate=image,category,author,seo&locale=en`)
        .then(response => response.json())
        .then(data => {
            for (const item of data.data) {
                const year = item.attributes.year;

                if (!yearsObj[year]) {
                    yearsObj[year] = [];
                }

                yearsObj[year].push(item);
            }

            let select_html = []
            let masonry_html = []
            let home_html = []

            Object.keys(yearsObj).sort((a, b) => b - a).forEach((item, index) => {
                if (!index){
                    Window.year = '.'+item
                }
                select_html.push(`<li><a id="select-${item}" href="#${item}" data-option-value=".${item}" title="${item}" class="${!index?'selected':''}">${item}</a></li>`)
                yearsObj[item].sort((a, b) => {
                    return new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
                }).forEach((_item,index) => {

                  let  ckeEle = document.createElement('div')
                    ckeEle.innerHTML=_item.attributes.ckeditor_content
                    let html = `
<li class="col-sm-6 col-lg-4 ${item}">
                                <div class="pop-course">
                                    <div class="course-thumb">
                                        <img class="event-img" src="${targetUrl + _item.attributes.image.data.attributes.url}" alt="">
                                        <span>${new Date(_item.attributes.eventDate).toLocaleString()}</span>
                                        <a href="blog.html?id=${_item.attributes.slug}" target="_blank" class="butn">Learn more</a>
                                    </div>
                                    <div class="course-meta">
                                        <div class="course-author">
                                            <img src="assets/images/author.png" alt="">
                                            <span>${_item.attributes.title}</span>
                                        </div>
                                        <p>${ckeEle.innerText.length>120?ckeEle.innerText.slice(0,140)+'...':ckeEle.innerText}</p>
                                    </div>
                                </div>
                            </li>`
                    masonry_html.push(html)
                    if (index<6){
                        home_html.push(html)
                    }
                })
            })

            yearOptionsElement.innerHTML = select_html.join('')
            setTimeout(()=>{
                const script = document.createElement("script");
                script.src = "assets/js/isotope-init.js";
                document.head.appendChild(script);
            },0)
            if (location.href.indexOf('events') > -1) {
                homeEventsElement.innerHTML = masonry_html.join('')
            } else {
                homeEventsElement.innerHTML = home_html.join('')
            }

            if (location.search.indexOf('year') > -1) {
                let year = location.search.split('=')[1]
                setTimeout(() => {
                    document.querySelector(`#select-${year}`).click()
                }, 800)
            } else {
                setTimeout(() => {
                    document.querySelector(`#select-${Object.keys(yearsObj).sort((a, b) => b - a)[0]}`).click()
                }, 800)
            }
        })
        .catch(error => console.error('Error:', error));

    fetch('\n' +
        `${targetUrl}/api/upcoming-events?pagination[limit]=99999&pagination[start]=0&pagination[withCount]=true&locale=en`)
        .then(response => response.json())
        .then(data => {
            data.data.forEach(item => {
                events.push({
                    start: item.attributes.eventStart,
                    end: item.attributes.eventEnd,
                    title: item.attributes.title,
                    description: item.attributes.description,
                })
            })
            initCalendar(events)
        })
        .catch(error => console.error('Error:', error));
}

function moreBtnClick() {
    let selectedLink = document.querySelector('a.selected');
    location.href = `events.html?year=${selectedLink.innerHTML}`
}

function initCalendar(events) {

    console.log(JSON.stringify(events))
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear'
        },
        views: {
            yearGrid: {
                type: 'dayGrid',
                duration: {years: 1},
                buttonText: 'year'
            }
        },
        navLinks: true, // can click day/week names to navigate views
        businessHours: true, // display business hours
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
            hour12: true
        },
        events: events
    });

    calendar.render();

}


getPostsList()
