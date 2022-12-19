import { FunctionComponent, useState } from "react";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Character } from "./APIResponsesTypes";
import { HierarchyCircularNode } from "d3";

interface Root{
    name: string;
    children: (Root | Character)[];
    id?: string;
    species?: string;
    gender?: string;

}

type Node = HierarchyCircularNode<Root>;

const Chart: FunctionComponent<{ data: Character[], category: string, name:string }> = ({data, category, name}) => {
    const container = useRef(null);
    
    
    useEffect( draw, [data]);

    function draw(){
        if (!data || !container.current) return;
        const svg = d3.select(container.current);
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        const grouped: Root[] = Array.from(d3.group(data, d => d.species), ([name, children]) => ({name, children}));
        const root: Root = ({
            name: name,
            children: grouped
            });
        const nodes = calculateNodes(root, width, height);
        
        const groupName = grouped.map(d => d.name);
        function getColor(item: string) : string {
            const color = d3.scaleOrdinal()
            .domain(groupName)
            .range(d3.schemeCategory10);

            return String(color(item));
        }

        const patterns = svg.select("defs")
            .selectAll("pattern")
            .data(data)
            .attr("id", d => d.id)
            .attr("patternUnits", "objectBoundingBox")
            .attr("width", 40)
            .attr("height", 40);
        
        patterns.select("image")
            .attr("href", d => d.image)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 40)
            .attr("height", 40);


        const bubbles = d3.select(".canvas").selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("class", "bubble")
            .attr("r", d => d.r)
            .attr("fill", d => "url(#" + String(d.data.id) + ")")
            .attr("stroke", d => getColor(String(d.data.species)))
            // .transition()
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    }

    function calculateNodes(
            root: Root,
            width: number,
            height: number
        ) : Node[] {
            const rootNode = d3.hierarchy(root)
                .sum(d => 1);

            console.log(rootNode);
            
            const pack = d3.pack<Root>()
                .size([width, height])
                .padding(1);
            return pack(rootNode).leaves();
        }

    return (
        <svg className="chart" width={window.innerWidth} height={window.innerHeight} ref={container}>
            <defs>
                {data.map(d => (<pattern key={d.id} className="bg_img">
                    <image />
                </pattern>))}
            </defs>
            <g className="canvas" transform="translate(20,20)" />
        </svg>
    )
};

export default Chart;