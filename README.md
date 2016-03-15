## Onondaga County Polling Location API

Onondaga County doesn't provide easy access to information on polling locations. You can either [read a PDF document](http://www.ongov.net/elections/documents/2015WEBSITEPOLLINGPLACELIST.pdf) to get polling locations, or use an outdated and not very user friendly [web application](http://vic.ntsdata.com/onondagaboe/pollingplacelookup.aspx).

I built this very simple API in the hopes that it would encourage people to think about the different ways that polling location information might be used. I also hope to show county officials that there are limitless possibilities for engaging people and enhancing the quality of services and information we get from government if they [release open data](http://opendata.guide/).

Much of the information provided by the existing County web application can also be obtained through the [Google Civic Information API](https://developers.google.com/civic-information/?hl=en). However, a polling location API specific to Onondaga County can provide more detailed, more accurate, and more recently updated information for voters. It can also act as an invitation to local technologists and software developers to build new ways to explore this important data and help ensure more people find their way to the polls on Election Day.

## Example usage

Base URL

```curl
http://apis.opensyracuse.org/elections/
```

```curl
~$ curl http://apis.opensyracuse.org/elections/?house_num=1500&street_name=South%20Geddes%20Street&zip=13207
```

```curl
curl -s -X POST -H 'Content-type: application/json' \
-H 'Accept: application/json' \
-d '{"house_num": 1500, "street_name": "South Geddes Street", "zip": 13207}' \
http://apis.opensyracuse.org/elections/ \
| jq .
```

Response 

```json
{
  "otherDistrict4": null,
  "otherDistrict3": null,
  "otherDistrict2": "16th County Legislative District",
  "otherDistrict1": "3rd City Council District",
  "assembly": "128th Assembly District",
  "senate": "53rd Senatorial District",
  "name": "ELMWOOD SCHOOL BLDG (GYM)",
  "fullAddress": "1728 SOUTH AVE SYRACUSE NY 13207 ",
  "disabled": "This Polling Place is Accessible to the disabled",
  "town": "Syracuse",
  "ward": "000",
  "district": "001",
  "school": null,
  "congress": "24th Congressional District"
}

```

Note: JSONP is supported by using a ```callback``` parameter with GET requests.
