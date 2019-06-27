<template>
  <div class="jobber"
       v-loading="loading">
    <TheHeader :title="title" />
    <div class="recipes-wrap">
      <el-table :data="recipes"
                :height="tableHeight"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="45"></el-table-column>
        <el-table-column label="名称"
                         prop="mf"
                         width="90"></el-table-column>
        <el-table-column label="属性"
                         prop="mfpro"
                         width="100"></el-table-column>
        <el-table-column label="紫材料"
                         width="150">
          <template slot-scope="scope">
            <span class="materials"
                  v-for="(material,i) in scope.row.materials1"
                  :title="material.nGold"
                  :key="i">{{material.name}}<span class="small">*{{material.amount}}</span></span>
            <p class="terror">{{scope.row.materials1.annotation}}</p>
          </template>
        </el-table-column>
        <el-table-column label="蓝材料"
                         width="150">
          <template slot-scope="scope">
            <span class="materials"
                  v-for="(material,i) in scope.row.materials2"
                  :title="material.nGold"
                  :key="i">{{material.name}}<span class="small">*{{material.amount}}</span></span>
            <p class="terror">{{scope.row.materials2.annotation}}</p>
          </template>
        </el-table-column>
        <el-table-column label="基础材料"><template slot-scope="scope">
            <span class="materials"
                  v-for="(material,i) in scope.row.materials3"
                  :title="material.nGold"
                  :key="i">{{material.name}}<span class="small">*{{material.amount}}</span></span>
            <p class="terror"
               v-if="scope.row.materials3">{{scope.row.materials3.annotation}}</p>
          </template></el-table-column>
        <el-table-column label="NPC材料"><template slot-scope="scope">
            <span class="materials"
                  v-for="(material,i) in scope.row.npcmaterials"
                  :key="i">{{material.name}}<span class="small">*{{material.amount}}</span></span>
            <p class="terror">{{scope.row.npcmaterials.annotation}}</p>
          </template></el-table-column>
        <el-table-column label="单价"
                         width="90"
                         prop="unit"
                         fixed="right">
          <template slot="header"
                    slot-scope="scope">单价<span class="small">(金)</span>
          </template>
        </el-table-column>
        <template slot="append">
          <table v-if="recipesSum>0"
                 class="recipesSum">
            <tr>
              <td colspan="6">
                <ul>
                  <li v-for="(recipe,index) in checkedRecipes"
                      :key="index"><span :class="recipe.pre">
                      <template v-if="index>0">+</template> {{recipe.mf}}<template v-if="recipe.type === '11'">{{recipe.mfpro}}</template>
                    </span></li>
                </ul>
              </td>
              <td class="sum-cell">{{recipesSum}}</td>
            </tr>
          </table>
        </template>
      </el-table>
    </div>
  </div>

</template>
<script>
import TheHeader from "@comp/common/TheHeader";
import {
  readPriceFile,
  getGoods,
  getRecipes,
  updateGoods,
  getManifest
} from "@/axiosData";
// const currentVersion = "0.2.220190503";

export default {
  data() {
    return {
      tableHeight: 500,
      title: "成本计算器",
      loading: true,
      recipes: [],
      checkedRecipes: []
    };
  },
  computed: {
    recipesSum: function() {
      let sum = 0;
      for (let r of this.checkedRecipes) {
        sum += r.unit;
      }
      return sum;
    }
  },
  components: {
    TheHeader
  },
  created() {
    this.initJobber();
    this.tableHeight = window.innerHeight - 50;
  },
  methods: {
    handleSelectionChange(val) {
      this.checkedRecipes = val;
    },
    tableRowClassName({ row }) {
      return `type${row.type}`;
    },
    async initJobber() {
      const appManifest = await getManifest();
      const { version: currentVersion } = appManifest;
      let AHfile = await this.getAHpath();
      let goodsRow = await getGoods();
      let patt1 = /\[\d{1,6}\]=\{\{nGold=\d{1,7},nSilver=\d{1,2},nCopper=\d{1,2}\},\d{10}\}/g;
      let priceArr = AHfile.match(patt1);
      let goods,
        goodsForFile,
        goodsList,
        currentGoodsFile = {};
      goodsList = this.pickoutGoods(
        /* 从上传数据中更新数据 --goods*/
        goodsRow.data,
        priceArr
      );
      goods = goodsList[0];
      goodsForFile = goodsList[1];
      let today = new Date(),
        tyear = today.getFullYear(),
        tmonth = today.getMonth() + 1,
        tday = today.getDate(),
        timestamp = today.getTime();
      currentGoodsFile.version = currentVersion;
      currentGoodsFile.date = {
        year: tyear,
        month: tmonth,
        day: tday,
        timestamp: timestamp
      };
      currentGoodsFile.data = goodsForFile;
      updateGoods(currentGoodsFile);
      let recipes = await getRecipes();
      this.recipes = this.formatRecipes(goods, recipes.data);
    },
    getAHpath() {
      return readPriceFile();
    },
    pickoutGoods(row, priceArr) {
      let goodslist = {};
      for (let item of row) {
        let id = item.id;
        goodslist[item.name] = item;
        for (let goods of priceArr) {
          if (id) {
            let re = new RegExp(
              "\\[" +
                id.toString() +
                "\\]={{nGold=(\\d{1,7}),nSilver=(\\d{1,2}),nCopper=(\\d{1,2})}"
            );
            let _goods = goods.match(re);
            if (_goods) {
              //匹配到物品,转换为json对象
              item = {
                id: id,
                nGold: _goods[1],
                nSilver: _goods[2],
                nCopper: _goods[3],
                name: item.name
              };
              let goodsJson = {
                id: id,
                nGold: _goods[1],
                nSilver: _goods[2],
                nCopper: _goods[3],
                name: item.name
              };
              goodslist[item.name] = goodsJson;
            }
          }
        }
      }
      return [goodslist, row];
    },
    formatRecipes(goods, recipes) {
      for (let recipe of recipes) {
        //单价计算 材料*数量
        recipe.unit = 0;
        for (let material of recipe.materials1 || []) {
          //紫材料
          // goods[material.name].nGold  材料名为material.name的单价
          // material.amount 材料的数量
          if (!goods[material.name]) {
            recipe.materials1.annotation = recipe.materials1.annotation
              ? recipe.materials1.annotation +
                ", " +
                "缺少" +
                material.name +
                "的价格"
              : "缺少" + material.name + "的价格";
            continue;
          } else {
            recipe.unit += goods[material.name].nGold * material.amount;
            material.nGold = goods[material.name].nGold;
          }
        }
        for (let material of recipe.materials2 || []) {
          //蓝材料
          if (!goods[material.name]) {
            recipe.materials2.annotation = recipe.materials2.annotation
              ? recipe.materials2.annotation +
                ", " +
                "缺少" +
                material.name +
                "的价格"
              : "缺少" + material.name + "的价格";
            continue;
          } else {
            recipe.unit += goods[material.name].nGold * material.amount;
            material.nGold = goods[material.name].nGold;
          }
        }
        for (let material of recipe.materials3 || []) {
          //基础材料
          if (!goods[material.name]) {
            recipe.materials3.annotation = recipe.materials3.annotation
              ? recipe.materials3.annotation +
                ", " +
                "缺少" +
                material.name +
                "的价格"
              : "缺少" + material.name + "的价格";
            continue;
          } else {
            recipe.unit += goods[material.name].nGold * material.amount;
            material.nGold = goods[material.name].nGold;
          }
        }
        for (let material of recipe.npcmaterials || []) {
          //NPC材料
          if (!goods[material.name]) {
            recipe.npcmaterials.annotation = recipe.npcmaterials.annotation
              ? recipe.npcmaterials.annotation +
                ", " +
                "缺少" +
                material.name +
                "的价格"
              : "缺少" + material.name + "的价格";
            // recipe.npcmaterials.annotation = "缺少"+material.name+"的价格";
            continue;
          } else {
            recipe.unit += goods[material.name].nGold * material.amount;
            material.nGold = goods[material.name].nGold;
          }
          // recipe.unit += Math.ceil(goods[material.name].nGold * npcmaterials.amount);
        }
        recipe.unit = recipe.unit / recipe.mfamount;
      }
      this.loading = false;
      return recipes;
    }
  }
};
</script>
<style lang="scss">
.jobber {
  margin: 0 auto;
  background-color: #fff;
  max-width: 1024px;
  height: 100%;
  /* @media screen and(max-width:1024px) {
    margin: 0 20px;
  } */
  .recipes-wrap {
    position: relative;
    .recipesSum {
      position: fixed;
      bottom: 0;
      width: 100%;
      left: 0;
      max-width: 1024px;
      right: 0;
      margin: auto;
      background-color: #ebebeb;
      z-index: 100;
      td {
        padding: 0 15px;
      }
      li {
        display: inline;
      }
      .sum-cell {
        text-align: right;
      }
    }
    .materials {
      margin-right: 3px;
    }
  }
  .type11,
  .type31,
  .type32,
  .type33 {
    background-color: #fdf5e6;
  }
  .type21,
  .type41 {
    background-color: #f0f9eb;
  }
}
</style>
