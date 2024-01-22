package main

import (
	"fmt"
	"strings"

	"github.com/gocolly/colly/v2"
)

func main() {
	// Target URL
	url := "https://biiitchan.com/m-ld/b4.2/?argument=snfBDnnQ&dmai=a63c4ada0bd983&gad_source=1&gclid=Cj0KCQiA2KitBhCIARIsAPPMEhKmPC0KumaGyjG7sVfE4OLVki2EEhqCykijArH_qVEURTxcEAARGu4aAq3OEALw_wcB"

	// Instantiate default collector
	c := colly.NewCollector()

	// Extract title element
	c.OnHTML("title", func(e *colly.HTMLElement) {
		fmt.Println("Title:", e.Text)
		// fmt.Println("HTML:", string(e.Response.Body))
	})

	// c.OnHTML("body", func(e *colly.HTMLElement) {
	// 	fmt.Println("Body:", e.Text)
	// 	// fmt.Println("HTML:", string(e.Response.Body))
	// })

	c.OnHTML("img", func(e *colly.HTMLElement) {
		fmt.Println("Image:", e.DOM.Nodes[0].Attr[0].Val)
		// fmt.Println("HTML:", string(e.Response.Body))
	})

	c.OnHTML("body", func(e *colly.HTMLElement) {
		// fmt.Println("HTML:", string(e.Response.Body))

		textList := strings.Split(e.Text, "\n")
		texts := []string{}
		for _, text := range textList {
			text = strings.TrimSpace(text)
			if text != "" {
				texts = append(texts, text)
			}
		}
		for _, text := range texts {
			fmt.Println(text)
		}
	})

	// Before making a request print "Visiting URL: https://XXX"
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting URL:", r.URL.String())
	})

	// Start scraping on https://XXX
	c.Visit(url)
}
