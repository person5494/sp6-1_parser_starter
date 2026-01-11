// @todo: напишите здесь код парсера

function parsePage() {
    // meta
    const [titleSite, nameSite] = document.querySelector('title').textContent.split('—');
    let keywords = document.querySelector('meta[name="keywords"]').getAttribute('content').split(',');
    keywords = keywords.map(item => item.trim());
    
    const opengraphK = document.querySelectorAll('meta[property]');
    let opengraphKeys = [];
    opengraphK.forEach(item => {
        opengraphKeys.push(item.getAttribute('property'))
    });
    opengraphKeys = opengraphKeys.map(item => item.slice(3));
    
    const opengraphV = document.querySelectorAll('meta[property]');
    let opengraphValues = [];
    opengraphV.forEach(item => {
        opengraphValues.push(item.getAttribute('content'))
    });
    

    const opengraph = {};
    for (let i = 0; i < opengraphKeys.length; i++) {
        opengraph[opengraphKeys[i]] = opengraphValues[i];
    }
    opengraph['title'] = opengraph['title'].split(' ').slice(0, 2).join(' ');

    // product
    const product = document.querySelector('section.product');
    const imagesQS = document.querySelectorAll('button img');
    const images = [];
        imagesQS.forEach(item => {
        const image = {
        'preview': item.getAttribute('src'),
        'full': item.dataset.src,
        'alt': item.getAttribute('alt')
        }
        images.push(image);
    });

    let productName = document.querySelector('h1').textContent;

    const category = [];
    const discount = [];
    const label = [];
    const green = document.querySelectorAll('.green');
    const blue = document.querySelectorAll('.blue');
    const red = document.querySelectorAll('.red');
    green.forEach(item => {
        category.push((item.textContent).trim());
    })
        blue.forEach(item => {
        label.push((item.textContent).trim());
    })
        red.forEach(item => {
        discount.push((item.textContent).trim());
    })

    const tags = {
        'category': category,
        'label': label,
        'discount': discount
    };

    let [span, priceWithCurr, oldPrice] = document.querySelector('.price').textContent.split('\n');
    price = Number(priceWithCurr.trim().slice(1));
    oldPrice = Number(oldPrice.trim().slice(1));
    
    let disc = 0;
    if (price < oldPrice) {
        disc = oldPrice - price;
    } else {
        disc = `0%`;
    }

    let symbol = priceWithCurr.trim();
        symbol = symbol[0];
    let currency = '';
    
    if (symbol === '₽') {
        currency = 'RUB';
    } else if (symbol == '$') {
        currency = 'USD';
    } else if (symbol == '€') {
        currency = 'EUR';
    }

    const propert = document.querySelectorAll('.properties li');
    const propertiesKeys = [];
    propert.forEach(item => {
        propertiesKeys.push(item.firstElementChild.textContent);
    })
    const propertiesValues = [];
    propert.forEach(item => {
        propertiesValues.push(item.lastElementChild.textContent);
    })
    const properties = {};

    for (let i = 0; i < propertiesValues.length; i++) {
        properties[propertiesKeys[i]] = propertiesValues[i];
    }

    const fullDescrOrig = document.querySelector('.description');
    const fullDescr = fullDescrOrig.cloneNode(true);
            fullDescr.querySelectorAll('*').forEach(el => {
                [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
        })
    const fullDescrTxt = fullDescr.innerHTML.trim();
    
    // suggested
    const items = document.querySelectorAll('.suggested .items article');
    const suggested = [];
        items.forEach(item => {
            let symbol = item.querySelector('b').textContent.trim();
            symbol = symbol[0];
            let currency = '';
            if (symbol === '₽') {
                currency = 'RUB';
            } else if (symbol == '$') {
                currency = 'USD';
            } else if (symbol == '€') {
                currency = 'EUR';
            }
            const obj = {
            'name': item.querySelector('h3').textContent.trim(),
            'description': item.querySelector('p').textContent.trim(),
            'image': item.querySelector('img').getAttribute('src'),
            'price': item.querySelector('b').textContent.trim().slice(1),
            'currency': currency
        }
        suggested.push(obj);
        })

        // reviews
        const review = document.querySelectorAll('.reviews .items article');
        const reviews = [];
        review.forEach(item => {
            const ratArr = item.querySelectorAll('.rating .filled')
            const rating = ratArr.length;

            const author ={
                'avatar': item.querySelector('.author img').getAttribute('src'),
                'name': item.querySelector('.author span').textContent.trim()
            }
            const obj = {
            'rating': rating,
            'author': author,
            'title': item.querySelector('.title').textContent.trim(),
            'description': item.querySelector('div p').textContent.trim(),
            'date': item.querySelector('.author i').textContent.trim().replaceAll('/','.'),
        }
        reviews.push(obj);
        })

    return {
        meta: {
            'language': document.querySelector('html').getAttribute('lang'),
            'title': titleSite.trim(),
            'keywords': keywords,
            'description': document.querySelector('meta[name="description"]').getAttribute('content'),
            'opengraph': opengraph,
        },
        product: {
            'id': product.dataset.id,
            'images': images,
            'isLiked': document.querySelector('figure img').hasAttribute('active'),
            'name': productName.trim(),
            'tags': tags,
            'price': price,
            'oldPrice': oldPrice,
            'discount': disc,
            'discountPercent': `${((oldPrice - price) / oldPrice * 100).toFixed(2)}%`,
            'currency': currency,
            'properties': properties,
            'description': fullDescrTxt,
        },
        suggested: suggested,
        reviews: reviews
    };
}

window.parsePage = parsePage;