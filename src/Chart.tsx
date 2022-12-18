import { FunctionComponent } from "react";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Character as CharacterType } from "./APIResponsesTypes";

const Chart: FunctionComponent<{ data: CharacterType[] }> = ({data}) => {
    const container = useRef(null);

    useEffect( () => {
        if (data && container.current) draw();
    },
    [data]);

    const draw = () => {
        const svg = d3.select(container.current);
            const speciesUnique = [...new Set(data.map(d => d.species))];

            const color = d3.scaleOrdinal()
            .domain(speciesUnique)
            .range(d3.schemeCategory10);

            const patterns = svg.select("defs")
                .selectAll("pattern")
                .data(data)
                .attr("id", (d: any) => d.id)
                .attr("patternUnits", "objectBoundingBox")
                .attr("width", 40)
                .attr("height", 40);
            
            patterns.select("image")
                .attr("href", d => d.image)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 40)
                .attr("height", 40);

            const bubbles = d3.select(".canvas").selectAll(".bubble")
                .data(data)
                .attr("r", 20)
                .attr("cx", (d, i) => Math.floor(i % 20) * 40)
                .attr("cy", (d, i) => Math.floor(i / 10) * 40)
                .attr("fill", (d) => `url(#${d.id})`)
                .attr("stroke", (d: any) => String(color(d.species)));
    }

    return (
        <svg className="chart" width={window.innerWidth} height={window.innerHeight} ref={container}>
            <defs>
                {data.map(d => (<pattern key={d.id} className="bg_img">
                    <image />
                </pattern>))}
            </defs>
            <g className="canvas" transform="translate(20,20)">
                {data.map(d => (<circle key={d.id} className="bubble"></circle>))}
            </g>
        </svg>
    )
};

export default Chart;