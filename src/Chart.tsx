import { FunctionComponent } from "react";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { Character as CharacterType } from "./APIResponsesTypes";


const Chart: FunctionComponent<{ data: CharacterType[] }> = ({data}) => {
    const container = useRef(null);

    useEffect( () => {
        if (data && container.current) {
            const svg = d3.select(container.current);
            const speciesUnique = [...new Set(data.map(d => d.species))];

            const color = d3.scaleOrdinal()
            .domain(speciesUnique)
            .range(d3.schemeCategory10);

            const canvas = svg.append("g")
            .attr("class", "canvas")
            .attr("transform", "translate(20, 20)");

            const nodes = canvas.selectAll("g")
                .data(data)
                .join("g")
                .attr("id", d => d.id);
            
            nodes.append("circle")
                .attr("r", 10)
                .attr("cx", (d, i) => Math.floor(i % 10) * 40)
                .attr("cy", (d, i) => Math.floor(i / 10) * 40)
                .attr("fill", (d: any) => String(color(d.species)));
            
            nodes.append("text")
            .attr("dx", "1em")
            .attr("dy", "1em")
            .style("font-size", "14px")
            .attr("text", d => `${d.status} — ${d.species}`)
        }
    },
    [data]);

    return (
        <svg className="chart" width={1000} height={600} ref={container}/>
    )
};

export default Chart;