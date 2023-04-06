import { useState,useEffect,useRef } from "react";
import {Clock, CameraFlyTo,Viewer, Entity, Cesium3DTileset,KmlDataSource,GeoJsonDataSource,CzmlDataSource,BoxGraphics,PolygonGraphics } from "resium";
import Cesium, { Cartesian3,HeightReference, Math as CesiumMath,Color,JulianDate,SampledPositionProperty,TimeInterval,TimeIntervalCollection,PathGraphics,VelocityOrientationProperty } from "cesium";
import data from "./flightdata.json";

const Kumamoto = () => {
  const viewerRef = useRef();
  const [depth, setDepth] = useState();
  function handleChangeDepth(event) {
    setDepth(Number(event.target.value));
  }
  const [clock, setClock] = useState();

  const [layer1, setLayer1] = useState(false);
  const [layer2, setLayer2] = useState(false);
  const [layer3, setLayer3] = useState(false);
  const [layer4, setLayer4] = useState(false);

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

  useEffect(() => {
    async function handleZoomWithRecords() {
      // records を使った非同期処理を実行する
      // ズーム処理を実行する
      autoZoom();
    }
    handleZoomWithRecords();
  }, []);

  const autoZoom = () => {
    const viewer = viewerRef.current.cesiumElement;
  
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(130.564705, 32.924917, 100),
      duration: 0,
      orientation:{
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-20),
      }
    });

  };

  function startTrace(){
    const positionProperty = new SampledPositionProperty();
    const timeStepInSeconds = 30;
    const totalSeconds = timeStepInSeconds * (data.length - 1);
    const start = JulianDate.fromIso8601("2023-03-09T23:10:00Z");
    const stop = JulianDate.addSeconds(start,totalSeconds,new JulianDate());
  
    const flightData = data.map((item, index) => {
      const time = JulianDate.addSeconds(start, index * timeStepInSeconds, new JulianDate());
      const position = Cartesian3.fromDegrees(item.longitude, item.latitude, item.height);
  
 
      positionProperty.addSample(time,position)
    })
    
  
    const viewer = viewerRef.current.cesiumElement;
     
    const airplaneLine=<Entity
    availability={new TimeIntervalCollection([new TimeInterval({start:start,stop:stop})])}
    position={positionProperty}
    // point={{pixcelsize:'30',color:Color.GREEN}}
    model={{
      uri:'airplane.gltf',
      minimumPixelSize:100,
      // maximamScale:2000,
      outlineColor:Color.WHITE
    }}
    orientation={new VelocityOrientationProperty(positionProperty)}
    path={new PathGraphics({width:2})}
     tracked
    //  selected
    />

    const clock = (
      <Clock
      startTime={start}
      stopTime={stop}
      currentTime={start}
      multiplier={10}
      shouldAnimate={true}
    >

      {airplaneLine}
    </Clock>      
    )
    setClock(clock);
    //TODO:クォータービュー
  }
  
  return (
    <Viewer ref={viewerRef}>
      <div class="absolute top-0 left-0 rounded mx-1 my-1">
        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200 uppercase last:mr-0 mr-1">
        {extrudedHeight}
        </span>
        <input type="range" min="0" max="100" defaultValue="0" onChange={handleExtrudedHeightChange} step="5" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
      
 
        <button
          class="bg-blue-300 hover:bg-blue-200 text-white rounded px-4 py-2 mx-1"
          onClick={() =>{
            setLayer4(!layer4);
          }}
        >
          玉名市 LOD１
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
        <button
                class="bg-red-300 hover:bg-red-200 text-white rounded px-4 py-2 mx-1"
                onClick={startTrace}
                // onClick={startAnimation}
              >        
         周遊 
        </button>
       </div>

      {/* <CameraFlyTo
        destination={Cartesian3.fromDegrees(130.564705, 32.924917, 100)}
        duration={0}
        orientation={{
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-20),
        }} 
      />*/}
      {layer4 && (
        <>
          <Cesium3DTileset
            url="./tamana/tileset.json"
            onReady={(tileset) => {
              // viewerRef.current?.cesiumElement?.zoomTo(tileset);
            }}
        />
          <Entity position={Cartesian3.fromDegrees(-117.0, 35.0, 100000.0)}>
          <PolygonGraphics
            hierarchy={Cartesian3.fromDegreesArrayHeights([    
              130.467004,32.992300, 0,
              130.467004,32.839549, 0,
              130.627679,32.839549, 0,
              130.627679,32.992300, 0,])}
            extrudedHeight={extrudedHeight}
            material={Color.BLUE.withAlpha(0.2)}
          />
        </Entity>
        </>
      )}

      <KmlDataSource data={"./nagasu/mouzu.kml"} show={layer2}/>
 
      <Entity
        position={Cartesian3.fromDegrees(130.45, 32.93, 0)}
        model={{
          uri: "./nagasu/nagasu.glb",
          scale: 1.5,
        }}
        show={layer3}
      />
    {clock}
    </Viewer>
  );
}

export default Kumamoto
