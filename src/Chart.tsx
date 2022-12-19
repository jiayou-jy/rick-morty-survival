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
    image?: string | null;
}

type Node = HierarchyCircularNode<Root>;

const Chart: FunctionComponent<{ data: Character[], loading: boolean, category: string}> = ({data, loading, category}) => {
    const svgRef = useRef(null);
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);
    
    useEffect( draw, [data, width, height]);

    useEffect(() => {
        window.addEventListener("resize", sizeWindow);
        return () => window.removeEventListener("resize", sizeWindow);
    }, []);

    function sizeWindow(){
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight - 100;
        setWidth(newWidth);
        setHeight(newHeight);
    }

    function draw(){
        if (!data || data.length === 0 || !svgRef.current) return;
        sizeWindow();
        const svg = d3.select(svgRef.current);

        const grouped: Root[] = Array.from(d3.group(data, d => d.species), ([name, children]) => ({name, children}));
        const root: Root = ({
            name: "Root",
            children: grouped
            });
        const nodes = calculateNodes(root, width, height);
        
        const groupName = grouped.map(d => d.name);
            
        const patterns = svg.select("defs")
            .selectAll("pattern")
            .data(nodes.filter(d => d.data.image))
            .attr("id", d => String(d.data.id))
            .attr("patternUnits", "objectBoundingBox")
            .attr("width", 1)
            .attr("height", 1);
        
        patterns.select("image")
            .attr("href", d => String(d.data.image))
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", d => d.r * 2)
            .attr("height", d => d.r * 2);

        const bubbles = d3.select(".canvas").selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("class", "bubble")
            // .attr("r", d => d.r)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", d => (d.data.image) ? "url(#" + String(d.data.id) + ")" : "#fff")
            .attr("stroke", d => getColor(String(d.data.species), groupName));
        
        bubbles.transition()
            .delay((d, i) => Math.random() * 500)
            .duration(750)
            .attrTween("r", d => tweenR(d.r));
    }

    function getColor(item: string, domain: string[]) : string {
        const color = d3.scaleOrdinal()
        .domain(domain)
        .range(d3.schemeCategory10);

        return String(color(item));
    }

    function tweenR(r: number){
       const i = d3.interpolate(0, r);
        return (t: number) => String(i(t));
    }

    function calculateNodes(
            root: Root,
            width: number,
            height: number
        ) : Node[] {
            const rootNode = d3.hierarchy(root)
                .sum(d => 1);

            const pack = d3.pack<Root>()
                .size([width, height])
                .padding(4);
            return pack(rootNode).leaves();
        }
    
    if (loading) {
        return <h2>scanning...</h2>;
    } else {
        return (
        <svg className="chart" width={width} height={height} ref={svgRef}>
            <defs>
                {data.map(d => (<pattern key={d.id} className="bg_img">
                    <image />
                </pattern>))}
            </defs>
            <g className="canvas"/>
        </svg>
    )
    }
    
};

export default Chart;