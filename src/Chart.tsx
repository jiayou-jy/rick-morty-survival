import { FunctionComponent, useState, lazy } from "react";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Character, Location } from "./APIResponsesTypes";
import { HierarchyCircularNode } from "d3";
import Details from "./Details";

export interface Root{
    name: string;
    children: (Root | Character)[];
    id?: string;
    status?: string;
    species?: string;
    gender?: string;
    image?: string | null;
    location?: Location;
    episode?: string[];
    data?: Character;
}

export type Node = HierarchyCircularNode<Root>;

const Chart: FunctionComponent<{ data: Character[], loading: boolean, category: string}> = ({data, loading, category}) => {
    const svgRef = useRef(null);
    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);
    const [nodeData, setNodeData] = useState<Node[]>([]);
    const [datum, setDatum] = useState<Root | undefined>();
    const [showDetail, setShowDetail] = useState(false);
    
    useEffect( draw, [data, width, height]);

    useEffect(bubbleClickHandler,)

    useEffect(() => {
        window.addEventListener("resize", sizeWindow);
        return () => window.removeEventListener("resize", sizeWindow);
    }, []);

    function sizeWindow(){
        const newWidth = window.innerWidth - 250;
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
        setNodeData(nodes);
        
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
            .attr("fill-opacity", d => (d.data.status === "Dead")? "0.3" : "1")
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

    function bubbleClickHandler() {
        d3.select(".canvas").selectAll("circle")
        .on("click", (e, d:any) => {
            setDatum(d.data); 
            setShowDetail(!showDetail);
            d3.select(e.target)
            .style("stroke-width", () => showDetail? "2px" : "6px");
        })
        
    }
    
    if (loading) {
        return <h2>scanning...</h2>;
    } else {
        return (
        <div className="chart-container">
            <svg className="chart" width={width} height={height} ref={svgRef}>
                <defs>
                    {data.map(d => (<pattern key={d.id} className="bg_img">
                        <image />
                    </pattern>))}
                </defs>
                <g className="canvas">
                    {/* {nodeData.map(d => (<circle key={d.data.id} onClick={(e) => bubbleClickHandler(e, d)} />))} */}
                </g>
            </svg>
            {
                (datum && showDetail) ? (<Details datum={datum} />) : null
            }
            
        </div>
    )
    }
    
};

export default Chart;