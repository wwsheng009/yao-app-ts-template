import { FS, Process, Query } from "yao-node-client";

/**
 * 加载提示词模板
 * 数据来源：https://github.com/PlexPt/awesome-chatgpt-prompts-zh/blob/main/README.md
 * @returns
 */
function load_prompt_template() {
  var qb = new Query("xiang");
  let rc = qb.Get({
    sql: {
      stmt: "delete from prompt_template",
    },
  });
  var fs = new FS("system");
  var data = fs.ReadFile("/中文调教指南.md.txt");

  const words = data.split("\n");

  let startindex = 0;

  let title = "";
  let content = "";
  let newData: string[][] = [];
  words.forEach((line, index) => {
    if (line.length == 0) {
      return;
    }
    if (line.startsWith("# 正经指南")) {
      startindex = index;
    }

    if (startindex && index > startindex) {
      let matchs = line.match(/##\s(.*)$/);
      if (matchs && matchs.length == 2) {
        title = matchs[1];
      }
      matchs = line.match(/>\s(.*)$/);
      if (matchs && matchs.length == 2) {
        content = matchs[1];
      }
      if (title && content) {
        newData.push([title, content]);
        title = "";
        content = "";
      }
    }
  });

  rc = Process(
    "Models.chat.prompt_template.Insert",
    ["title", "content"],
    newData
  );
  //   console.log(rc);
  return rc;
}

load_prompt_template();
