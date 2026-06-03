import { MetadataRoute } from "next";


export default function sitemap():MetadataRoute.Sitemap{
    return [
     
{
    url:'http://localhost:3000/',
    lastModified:new Date()
},

{
      url:'http://localhost:3000/about-us',
    lastModified:new Date() 
},

{
      url:'http://localhost:3000/properties',
    lastModified:new Date() 
},

{
      url:'http://localhost:3000/services',
    lastModified:new Date() 
},


{
      url:'http://localhost:3000/services',
    lastModified:new Date() 
},


{
      url:'http://localhost:3000/login',
    lastModified:new Date() 
},

{
      url:'http://localhost:3000/sell-property',
    lastModified:new Date() 
},

{
      url:'http://localhost:3000/book-visit',
    lastModified:new Date() 
},


    ]
}