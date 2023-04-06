import { useState,useEffect,useRef } from "react";
import { Viewer, Entity, Cesium3DTileset,KmlDataSource,GeoJsonDataSource,CzmlDataSource,BoxGraphics,PolygonGraphics } from "resium";
import Cesium, { Cartesian3,HeightReference, Math as CesiumMath,Color  } from "cesium";


const Kumamoto = () => {
  const viewerRef = useRef();
  const [depth, setDepth] = useState();
  function handleChangeDepth(event) {
    setDepth(Number(event.target.value));
  }

  const [layer1, setLayer1] = useState(false);
  const [layer2, setLayer2] = useState(false);
  const [layer3, setLayer3] = useState(false);

  const czml1 = [
    {
      id: "document",
      name: "Polygon",
      version: "1.0",
    },
    {
      id: "Polygon",
      name: "polygon",
      polygon: {
        positions: {
          cartographicDegrees: [
            130.608148,32.802076, 0,
            130.608148,32.743842, 0,
            130.692225,32.743842, 0,
            130.692225,32.802076, 0,
          ],
        },
        material: {
          solidColor: {
            color: {
              rgba: [65, 125, 190, 90],
            },
          },
        },
        extrudedHeight: 30,//洪水の高さ10~50
        closeTop: true,
        closeBottom: true,
      },
    },
  ];

  const [extrudedHeight, setExtrudedHeight] = useState(0);

  const handleExtrudedHeightChange = (event) => {
    setExtrudedHeight(parseFloat(event.target.value));
  };

  const xxxx = () =>{
    setLayer1(!layer1);
  }


  return (
    <Viewer ref={viewerRef}>
      <div class="absolute top-0 left-0 rounded mx-1 my-1">
        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200 uppercase last:mr-0 mr-1">
        {extrudedHeight}
        </span>
        <input type="range" min="0" max="100" defaultValue="0" onChange={handleExtrudedHeightChange} step="5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
      
 

        <button
          class="bg-red-300 hover:bg-red-200 text-white rounded px-4 py-2 mx-1"
          onClick={() =>{
            setLayer1(!layer1);
          }}
        >
          熊本市 LOD１
        </button>
        <button
          class="bg-green-300 hover:bg-green-200 text-white rounded px-4 py-2 mx-1"
          onClick={() =>{
            setLayer2(!layer2);
          }}
        >
          長洲町道路網図
        </button>
        <button
          class="bg-orange-300 hover:bg-orange-200 text-white rounded px-4 py-2 mx-1"
          onClick={() =>{
            setLayer3(!layer3);
          }}
        >
          長洲町建物
        </button>
        
      </div>
      {layer1 && (
        <Cesium3DTileset
          url="./kumamoto/tileset.json"
          onReady={(tileset) => {
            viewerRef.current?.cesiumElement?.zoomTo(tileset);
          }}
        />
      )}
        <Entity position={Cartesian3.fromDegrees(-117.0, 35.0, 100000.0)}>
          <PolygonGraphics
            hierarchy={Cartesian3.fromDegreesArrayHeights([    
              130.508148,32.802076, 0,
              130.508148,32.743842, 0,
              130.792225,32.743842, 0,
              130.792225,32.802076, 0,])}
            extrudedHeight={extrudedHeight}
            material={Color.BLUE.withAlpha(0.2)}
          />
        </Entity>
        
      {/* <KmlDataSource data={"./kumamoto/your_geo_json.kml"}/> */}
      {/* <GeoJsonDataSource data={"./kumamoto/mouzu.geojson"}/> */}
      
      {/* {layer2 && (
        
      )}  */}
      <KmlDataSource data={"./kumamoto/mouzu.kml"} show={layer2}/>
 
      <Entity
        position={Cartesian3.fromDegrees(130.45, 32.93, 0)}
        model={{
          uri: "./kumamoto/nagasu.glb",
          scale: 1.5,
        }}
        show={layer3}
      />

      {/* <Entity
        name="BoxGraphics"
        description="BoxGraphics!!"
        position={Cartesian3.fromDegrees(130.655797, 32.769116, 100)}
      >
        <BoxGraphics
          material={Color.RED}
          dimensions={new Cartesian3(400000.0, 300000.0, 500000.0)}
        />
      </Entity> */}
    </Viewer>
  );
}

export default Kumamoto
