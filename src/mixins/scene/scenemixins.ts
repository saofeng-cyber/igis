import { Vue, Component } from 'vue-property-decorator';
import { sceneType } from '@/api/common-scene-type/scene-type'

@Component({})
export default class SceneTypeMixin extends Vue {
  sceneTypeList: any = [] // 场景类型列表

  sceneTypeParams: any = {
    dictGroup: 'SceneType'
  }

  created() {
    this.getSceneTypeList()
  }

  /* 查询场景类型列表 */
  getSceneTypeList() {
    sceneType
      .getSceneTypeList(this.sceneTypeParams)
      .then((response: any) => {
        this.sceneTypeList = response
      })
  }
}
