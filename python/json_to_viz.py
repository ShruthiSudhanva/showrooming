#!/usr/bin/python

import sys
import json

def makeChildren(dictionary):
    categories = ["F","G","S","C","E"]
    for i in range(5):
        new_dict = {"name":categories[i], "price":0, "count":0}
        dictionary["children"].append(new_dict)
    return dictionary

if __name__ == '__main__':
    onlonl = dict()
    onlonl["name"] = "ONLONL"
    onlonl["children"] = []
    stronl = dict()
    stronl["name"] = "STRONL"
    stronl["children"] = []
    onlstr = dict()
    onlstr["name"] = "ONLSTR"
    onlstr["children"] = []
    strstr = dict()
    strstr["name"] = "STRSTR"
    strstr["children"] = []
    
    json_data=open('new_output.js')
    data = json.load(json_data)
    json_data.close()

    onlonl = makeChildren(onlonl)
    stronl = makeChildren(stronl)
    onlstr = makeChildren(onlstr)
    strstr = makeChildren(strstr)

    categories = ["F","G","S","C","E"]

    for record in data:
        if record["shoppingType"] == "ONLONL":
            onlonl["children"][categories.index(str(record["category"]))]["price"] += float(record["price"])
            onlonl["children"][categories.index(str(record["category"]))]["count"] += 1
        if record["shoppingType"] == "ONLSTR":
            onlstr["children"][categories.index(str(record["category"]))]["price"] += float(record["price"])
            onlstr["children"][categories.index(str(record["category"]))]["count"] += 1
        if record["shoppingType"] == "STRONL":
            stronl["children"][categories.index(str(record["category"]))]["price"] += float(record["price"])
            stronl["children"][categories.index(str(record["category"]))]["count"] += 1
        if record["shoppingType"] == "STRSTR":
            strstr["children"][categories.index(str(record["category"]))]["price"] += float(record["price"])
            strstr["children"][categories.index(str(record["category"]))]["count"] += 1

    output_file = open("data.js", "w")
    json.dump(onlonl, output_file, indent=2)
    json.dump(onlstr, output_file, indent=2)
    json.dump(stronl, output_file, indent=2)
    json.dump(strstr, output_file, indent=2)
    output_file.close()
    print onlonl
    print onlstr
    print stronl
    print strstr
