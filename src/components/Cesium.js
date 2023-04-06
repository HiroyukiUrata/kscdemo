import { Entity, Viewer,BoxGraphics } from 'resium'
import { Cartesian3,Color } from 'cesium'

	export default function Cesium() {
	  return (
		<Viewer>
			<Entity
			name="BoxGraphics"
			description="BoxGraphics!!"
			position={Cartesian3.fromDegrees(0.0707383, 40.7117244, 100)}>
			<BoxGraphics material={Color.RED} dimensions={new Cartesian3(400000.0, 300000.0, 500000.0)} />

			</Entity>
			<Entity
			name="BoxGraphics"
			description="BoxGraphics!!"
			position={Cartesian3.fromDegrees(1.0707383, 41.7117244, 100)}>
			<BoxGraphics material={Color.BLUE} dimensions={new Cartesian3(400000.0, 300000.0, 500000.0)} />

			</Entity>
			<Entity
			name="BoxGraphics"
			description="BoxGraphics!!"
			position={Cartesian3.fromDegrees(10.0707383, 61.7117244, 100)}>
			<BoxGraphics material={Color.GREEN} dimensions={new Cartesian3(400000.0, 300000.0, 500000.0)} />

			</Entity>
		</Viewer>
	  )
	}