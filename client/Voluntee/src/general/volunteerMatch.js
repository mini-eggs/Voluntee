import {volunteerMatchAccountName,volunteerMatchAccountKey} from '../keys/keys'

const baseUrl = `https://www.volunteermatch.org`
const searchOrgEndpoint = `/search/opp`
const ext = `.jsp`
const cheerio = require('cheerio-without-node-native')

async function getEventFromId (props) {
    try {
        const url = `${baseUrl}${searchOrgEndpoint}${props.id}${ext}`
        if(__DEV__) {
          console.log(url)
        }
        const res = await fetch(url)
        const html = await res.text()
        let $ = cheerio.load(html)
        const htmlBody = $('body')
        const link = baseUrl + htmlBody.find('.fn.org').attr('href')

        if(typeof htmlBody.find('.fn.org').attr('href') === 'undefined') {
          return new Promise.reject({status: 0, msg: 'This event has been removed'})
        }

        const title = htmlBody.find(`#${props.id}`).text()
        const org = htmlBody.find('.find.org').text()
        const causes = htmlBody.find('.cause_icon').map((index, item) => $(item).find('.sprite_profile').attr('title'))
        const desc = $(htmlBody.find('.opp_summary')[0]).text().trim()
        const skills = $($('.opp_lower_container_section ul')[0]).find('li').map((index,item) => $(item).text())
        const requirements = $($('.opp_lower_container_section ul')[1]).find('li').map((index,item) => $(item).text())
        if(__DEV__) {
          console.log(link)
        }
        const orgRes = await fetch(link)
        const orgHtml = await orgRes.text()
        $ = cheerio.load(orgHtml)
        const orgHtmlBody = $('body')
        const orgName = $(orgHtmlBody.find('.list_box_name .rwd_show')[0]).text()
        const contact = {name: $(orgHtmlBody.find('.org_contact li')[0]).text(),number: $(orgHtmlBody.find('.org_contact li')[1]).text()}
        const missionStatement = $(orgHtmlBody.find('#more_info_container section')[0]).find('p').map((index,item) => $(item).text().trim())
        
        return new Promise.resolve({
            title:title,
            causes:Array.from(causes),
            desc:desc,
            skills:Array.from(skills),
            address:props.address,
            dates:props.dates,
            contact:contact,
            requirements:Array.from(requirements),
            missionStatement:Array.from(missionStatement),
            orgName: orgName
        })
    }
    catch(err) {
        return new Promise.reject(err)
    }
}
export {getEventFromId}

const getHelloWorldFromVolunteerMatch = props => new Promise((resolve,reject) => {

    let data = `{"name":"evan123"}`

    let url = 'http://www.volunteermatch.org/api/call'
    url += '?action=helloWorld'
    url += '&key=' + volunteerMatchAccountKey
    url += '&query=' + data

    let res = new Request(url, {
        method: 'GET',
        headers: {
            'Accept-Charset': 'UTF-8',
            'Content-Type': 'application/json'
        }
    })

    fetch(res)
        .then( json => json.json())
        .then( data => resolve(data))
        .catch( err => reject(err))
})
export {getHelloWorldFromVolunteerMatch}

const searchOpportunities = props => new Promise((resolve,reject) => {

    //amount per page is always ten
    //results in div w/ ID of `searchresults`
    //each item  in div w/ classNames of `searchitem PUBLIC`

    //props
    //page - 0 for first page 1 for second page/etc
    //zip

    let url = 'https://www.volunteermatch.org/search'
    url += '?o=eventdate'
    url += '&l=' + props.zip.toString()
    url += '&s=' + ((props.page * 10) + 1).toString()

    console.log(url)

    let res = new Request(url, {
        method: 'GET',
        headers: {
            'Accept-Charset': 'UTF-8',
            'Content-Type': 'application/json'
        }
    })

    let events = []

    fetch(res)
        .then( html => html.text())
        .then( data => {
            
            let $ = cheerio.load(data)
            let items = $('#searchresults .searchitem.PUBLIC')

            items.map((index, item) => {

                item = $(item)

                let desc = item.find('.searchitem_desc.ellipsis_vert').text()
                desc = desc.split('...')[0].trim() + '...'

                let geo = item.find('.geotag').text().trim().replace('(','').replace(')','')
                let lat = null, long = null

                if(geo.length > 0){
                    lat = geo.split(',')[0]
                    long = geo.split(',')[1]
                }

                let datesFixed = []

                let dates = item.find('.oppdate.ym_rwd_show').text().trim().replace(/(\r\n|\n|\r)/gm,"").split("  ").forEach( part => {
                    if(part != "") datesFixed.push(part.replace('-','').trim())
                })

                events.push({
                    id: item.attr('id').replace('opp',''),
                    name:item.find('h3 .psr_link').text(),
                    org:item.find('.orgid .psr_link').text(),
                    desc:desc,
                    address:{
                        street:$(item.find('.street-address')[0]).text(),
                        city:$(item.find('.locality')[0]).text(),
                        state:$(item.find('.region')[0]).text(),
                        zip:$(item.find('.postal-code')[0]).text(),
                        geo:{
                            lat:lat,
                            long:long
                        }
                    },
                    dates:datesFixed
                })
            })

            resolve(events)
        })
        .catch( err => reject(err))
})
export {searchOpportunities}