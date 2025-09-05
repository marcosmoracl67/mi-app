import { mdiAlphaB } from "@mdi/js";
import { mdiAlphaD } from "@mdi/js";
import { mdiAlphaC } from "@mdi/js";
import { mdiAlphaA } from "@mdi/js";
import React from "react";
import {
    Button,
    Card,
    CardTitle,
    CardContent,
    CardActions,
    ExpandableButtonGroup,
} from "ui-io-solutions";

const Playground = () => {
    return (
        <div style={{ backgroundColor: "var(--background2)" }} className="pa-4">
            <Card className="ma-2">
                <CardTitle>This is Title</CardTitle>

                <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore quia nostrum tenetur quis ea corporis numquam?
                    Obcaecati veniam quasi aliquam laboriosam aspernatur
                    reiciendis perspiciatis minus, praesentium quae ad! Nisi,
                    at.
                </CardContent>

                <CardContent>
                    <ExpandableButtonGroup
                        isExpanded
                        options={[
                            { icon: mdiAlphaA, value: "1" },
                            { icon: mdiAlphaB, value: "2" },
                            { icon: mdiAlphaC, value: "3" },
                            { icon: mdiAlphaD, value: "4" },
                        ]}
                    ></ExpandableButtonGroup>
                </CardContent>

                <CardActions>
                    <Button>THIS IS A BUTTON</Button>
                </CardActions>
            </Card>

            <Card className="nav-bar ma-2">
                <CardTitle>This is Another Card</CardTitle>

                <CardContent>
                    This card has <code>nav-bar</code> utility class
                </CardContent>

                <CardActions>
                    <Button>THIS IS A BUTTON</Button>
                </CardActions>
            </Card>

            <div className="io-panel ma-2">
                <CardTitle>
                    <code>&lt;div className="io-panel"/&gt;</code>
                </CardTitle>

                <CardContent>
                    Esta tarjeta tiene la clase <code>io-panel</code>. No tiene
                    bordes redondeados ni tampoco sombra.
                </CardContent>
                
                <CardActions>
                    <Button>THIS IS A BUTTON</Button>
                </CardActions>
            </div>

            <Card className="io-stroke-info ma-2">
                <CardTitle>This is Another Card</CardTitle>
                <CardContent>
                    This card has <code>io-stroke-info</code> utility class
                </CardContent>
            </Card>

            <Card className="io-stroke-warning ma-2">
                <CardTitle>This is Another Card</CardTitle>
                <CardContent>
                    This card has <code>io-stroke-warning</code> utility class
                </CardContent>
            </Card>

            <Card className="io-selectable highlight ma-2">
                <CardTitle>
                    <code>
                        &lt;Card className="io-selectable highlight"/&gt;
                    </code>
                </CardTitle>
            </Card>

            <Card className="io-selectable highlight-nav ma-2">
                <CardTitle>
                    <code>
                        &lt;Card className="io-selectable highlight-nav"/&gt;
                    </code>
                </CardTitle>
            </Card>
        </div>
    );
};

export default Playground;