/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as d3 from "d3";

export default class SVGTooltip {
  private readonly svg: d3.Selection<any, unknown, null, undefined>;
  private readonly tooltip: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly content: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly border: d3.Selection<SVGPathElement, unknown, null, undefined>;
  private readonly margins: { top: number; bottom: number; left: number; right: number };

  // Size of the indicator
  readonly indicatorSize = 5;
  // Extra spacing between the tooltip and the target point
  readonly indicatorOffset = 5;
  // Border thickness
  readonly borderSize = 2;
  // Spacing between the content and the border
  readonly innerMargin = 5;

  // Are we visible?
  private visible = false;
  // The requested position to display the tooltip
  private x = 0;
  private y = 0;

  constructor(svg: SVGSVGElement, margins = { top: 0, bottom: 0, left: 0, right: 0 }) {
    this.svg = d3.select(svg);
    this.tooltip = this.svg.append("g").style("pointer-events", "none");
    this.margins = margins;

    this.border = this.tooltip
      .append("path")
      .attr("fill", "white")
      .attr("stroke-width", this.borderSize)
      .attr("stroke", "black");

    this.content = this.tooltip.append("g");
  }

  show() {
    // Move the tooltip to the front
    this.tooltip.raise();

    if (!this.visible) {
      this.visible = true;
      this.draw();
    }
  }

  hide() {
    if (this.visible) {
      this.visible = false;
      this.draw();
    }
  }

  setText(text: string) {
    this.content.select("*").remove();

    this.content
      .append("text")
      .selectAll("tspan")
      .data(text.split(/\n/))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i * 1.1}em`)
      .text((d) => d);

    this.draw();
  }

  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.draw();
  }

  private draw() {
    if (!this.visible) {
      this.tooltip.attr("visibility", "hidden");
      return;
    }
    this.tooltip.attr("visibility", "visible");

    // Get the boudiding box of the content
    const { x: cx, y: cy, width: cw, height: ch } = this.content.node()!.getBBox();

    const canvasWidth = this.svg.node()!.clientWidth - (this.margins.left + this.margins.right);
    const canvasHeight = this.svg.node()!.clientHeight - (this.margins.top + this.margins.bottom);

    const w = cw + 2 * this.innerMargin; // Container width accounting for margins
    const h = ch + 2 * this.innerMargin; // Container height accounting for margins
    let x = this.x + cx - w / 2; // X is horizontally centered
    let y = this.y - cy + this.indicatorSize + this.indicatorOffset; // Y is below the indicator

    // The horizontal position where the indicator will start (left)
    let ix1 = w / 2 - this.indicatorSize;
    // The horizontal position where the indicator will peak (middle)
    let ix2 = ix1 + this.indicatorSize;
    // The horizontal position where the indicator will end (right)
    let ix3 = ix1 + 2 * this.indicatorSize;

    const overflow = x + w - canvasWidth; // How much the tooltip is 'leaking' from the canvas' right side
    const undeflow = 0 - x; // How much the tooltip is 'leaking' from the canvas' left side
    if (overflow > 0) {
      // Go left to fit inside the canvas
      x -= overflow + this.borderSize / 2;
      ix1 += overflow;
      ix2 += overflow;
      ix3 += overflow;

      if (ix3 > w) {
        // If the indicator is overflowing, change it's shape
        ix1 = w - this.indicatorSize;
        ix2 = w;
        ix3 = w;
      }
    } else if (undeflow > 0) {
      // Go right to fit inside the canvas
      x += undeflow + this.borderSize / 2;
      ix1 -= undeflow;
      ix2 -= undeflow;
      ix3 -= undeflow;

      if (ix1 < 0) {
        // If the indicator is underflowing, change it's shape
        ix1 = 0;
        ix2 = 0;
        ix3 = this.indicatorSize;
      }
    }

    // Shortcut
    const i = this.indicatorSize;

    // Top/Bottom indicator path
    // https://www.w3schools.com/graphics/svg_path.asp
    const pathTop = `M${cx},${cy}h${ix1}L${cx + ix2},${cy - i}L${cx + ix3},${cy}H${cx + w}v${h}h${-w}z`;
    const pathBottom = `M${cx},${cy}h${w}v${h}H${cx + ix3}L${cx + ix2},${cy + h + i}L${cx + ix1},${cy + h}H${cx}z`;

    // Default path displays the indicator on top
    let path = pathTop;

    if (y + h > canvasHeight) {
      // Tooltip doesn't fit below the point, move it upside
      y = this.y - cy - h - this.indicatorSize - this.indicatorOffset;
      path = pathBottom;
    }

    this.content.attr(
      "transform",
      `translate(${x + this.margins.left + this.innerMargin}, ${y + this.margins.top + this.innerMargin})`
    );
    this.border.attr("transform", `translate(${x + this.margins.left}, ${y + this.margins.top})`);
    this.border.attr("d", path);
  }
}
