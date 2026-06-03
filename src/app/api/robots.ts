import { MetadataRoute } from "next";
import { userAgent } from "next/server";

export default function robot():MetadataRoute.Robots{
    return{
        rules:{
            userAgent:'*',
            allow:"/",
            disallow:[]
        },
        sitemap:'http://localhost:3000/sitemap.xml'
    }
}