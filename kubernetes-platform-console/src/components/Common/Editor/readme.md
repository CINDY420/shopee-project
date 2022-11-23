React component example:

```jsx
import * as React from 'react'
import { CLUSTER_STATUS as STATUS } from 'constants/cluster'
import jsYaml from 'js-yaml'

const value = "{\"exec\":{\"command\":[\"bash\",\"-c\",\"bash  \\u003c\\u003cEOF\\nexport LOGDIR=\\\\$(echo $POD_NAME | cut -d '-' -f3,4 --output-delimiter='')\\nmkdir -p /data/log/\\\\$LOGDIR\\nrm -rf log\\nln -s /data/log/\\\\$LOGDIR log\\npython -c '\\nimport sys,json\\napp=\\\"demo\\\"\\nspecf=\\\"deploy/demo.json\\\"\\nwith open(specf) as f:\\n    spec = json.load(f)\\npds = spec.get(\\\"run\\\", {}).get(\\\"port_definitions\\\", [])\\nspec[\\\"run\\\"][\\\"acquire_prometheus_port\\\"] = False\\nspec[\\\"run\\\"][\\\"enable_prometheus\\\"] = False\\n\\ntry:\\n    del spec[\\\"run\\\"][\\\"smoke\\\"]\\nexcept KeyError:\\n    pass\\n\\nnew_pds = []\\nnew_pds.append({\\\"submodule\\\": app, \\\"port\\\": \\\"8080\\\"})\\nport = 8081\\nfor pd in pds:\\n    if pd.get(\\\"submodule\\\", \\\"\\\") == app:\\n        continue\\n    elif pd.get(\\\"submodule\\\", \\\"\\\") != \\\"\\\":\\n        pd[\\\"expose_port\\\"] = str(port)\\n        new_pds.append(pd)\\n        port += 1\\nspec[\\\"run\\\"][\\\"port_definitions\\\"] = new_pds\\nwith open(specf, \\\"w\\\") as f:\\n    f.write(json.dumps(spec, indent=4))\\n'\\nEOF\\n\"]}}"

const yamlValue = jsYaml.dump(JSON.parse(value))


// 这个函数是为了解决style guide的报错，没实际用处
const noUse = () => {}

<Editor mode='yaml' height='500px' value={yamlValue} />
```
