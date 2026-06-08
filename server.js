const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const app = express();
const DATA_PATH = path.join(__dirname, "data", "availability.json");
const INITIAL_MEMBERS = [
  {
    id: "u1",
    name: "Arjun Mehta",
    avatar: "AM",
    role: "Frontend Engineer",
    color: "#4F6EF7",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    avatar: "PS",
    role: "Product Manager",
    color: "#10B981",
  },
  {
    id: "u3",
    name: "David Chen",
    avatar: "DC",
    role: "Backend Engineer",
    color: "#F59E0B",
  },
  {
    id: "u4",
    name: "Leila Torres",
    avatar: "LT",
    role: "UX Designer",
    color: "#EC4899",
  },
  {
    id: "u5",
    name: "Marcus Reed",
    avatar: "MR",
    role: "DevOps Engineer",
    color: "#8B5CF6",
  },
  {
    id: "u6",
    name: "Sana Patel",
    avatar: "SP",
    role: "Data Analyst",
    color: "#06B6D4",
  },
  {
    id: "u7",
    name: "Tom Nguyen",
    avatar: "TN",
    role: "QA Engineer",
    color: "#F97316",
  },
  {
    id: "u8",
    name: "Fatima Al-Amin",
    avatar: "FA",
    role: "Scrum Master",
    color: "#14B8A6",
  },
];

async function readData() {
  try {
    const body = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(body);
  } catch {
    return {
      availability: INITIAL_MEMBERS.reduce((acc, member) => {
        acc[member.id] = true;
        return acc;
      }, {}),
    };
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/team", async (req, res) => {
  const data = await readData();
  res.json({ members: INITIAL_MEMBERS, availability: data.availability });
});

app.put("/api/availability", async (req, res) => {
  const { availability } = req.body;

  if (!availability || typeof availability !== "object") {
    return res
      .status(400)
      .json({ error: "Request body must include availability." });
  }

  await writeData({ availability });
  res.json({ availability });
});

app.patch("/api/availability/:id", async (req, res) => {
  const { id } = req.params;
  const body = await readData();
  const current = body.availability;

  if (!Object.prototype.hasOwnProperty.call(current, id)) {
    return res.status(404).json({ error: "Member not found." });
  }

  const next = {
    ...current,
    [id]:
      typeof req.body.available === "boolean"
        ? req.body.available
        : !current[id],
  };

  await writeData({ availability: next });
  res.json({ availability: next });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
