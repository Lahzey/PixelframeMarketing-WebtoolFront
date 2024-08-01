import "../../stlyes/label-collapse.css"

import {TbTriangleFilled} from "react-icons/tb";
import {useState} from "react";

export default function Collapse({open, children}) {
    return (
        <div className={"Collapse" + (open ? " open" : "")}>
            <div className="Collapse-inner">{children}</div>
        </div>
    );
}

export function LabelCollapse({labelClassName, label, children, defaultCollapsed = false}) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    
    const iconRotation = collapsed ? 90 : 180;
    
    return (
        <div className="LabelCollapse">
            <div className={labelClassName + " LabelCollapse-label"} onClick={() => setCollapsed(!collapsed)}>
                <TbTriangleFilled style={{ transform: "rotate(" + iconRotation + "deg)", scale: "75%" }} className="animated-rotation"/>
                {label}
            </div>
            <Collapse open={!collapsed}>
                {children}
            </Collapse>
        </div>
    );
}