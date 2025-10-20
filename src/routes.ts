import express, { Request, Response } from "express";
import db from "./database/connection";
import convertHourToMinutes from "./utils/convert-hour-to-minutes";

const routes = express.Router();

routes.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

routes.post("/classes", async (_req: Request, res: Response) => {
  const {
    name,
    avatar,
    whatsapp,
    linkedin,
    instagram,
    youtube,
    bio,
    subject,
    cost,
    schedule,
  } = _req.body ?? {};

  // Verifica se algum campo é null/undefined/string vazia
  const required = {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule,
  };
  const missingKey = Object.keys(required).find(
    (k) =>
      required[k as keyof typeof required] === null ||
      required[k as keyof typeof required] === undefined ||
      (typeof required[k as keyof typeof required] === "string" &&
        (required[k as keyof typeof required] as string).trim() === "")
  );

  if (missingKey) {
    return res
      .status(400)
      .json({ message: `Campo '${missingKey}' é obrigatório.` });
  }

  try {
    const trx = await db.transaction();

    const [idCoache] = await trx("coaches").insert({
      name: name,
      avatar: avatar,
      whatsapp: whatsapp,
      linkedin: linkedin,
      instagram: instagram,
      youtube: youtube,
      bio: bio,
    });

    const [idClasses] = await trx("classes").insert({
      subject: subject,
      cost: cost,
      coach_id: idCoache,
    });

    const classSchedule = schedule.map((item: any) => {
      return {
        week_day: item.week_day,
        from: convertHourToMinutes(item.from),
        to: convertHourToMinutes(item.to),
        class_id: idClasses,
      };
    });

    await trx("classes_schedule").insert(classSchedule);

    await trx.commit();

    return res.status(201).json({
      message: "Classes criadas com sucesso.",
      idClasses,
      idCoache,
      classSchedule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar classes." });
  }
});

routes.delete("/classes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRows = await db("classes").where("id", id).del();

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Classe não encontrada." });
    }

    return res.status(200).json({ message: "Classe deletada com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar classe." });
  }
});

routes.get("/coaches", async (req: Request, res: Response) => {
  const filters = req.query;

  const subject = filters.subject as string | undefined; // Uso de 'undefined' para tipos opcionais
  const week_day = filters.week_day as string | undefined;
  const time = filters.time as string | undefined;
  const timeInMinutes = time ? convertHourToMinutes(time) : undefined; // Converte apenas se 'time' estiver definido

  console.log(subject);
  console.log(week_day);
  console.log(timeInMinutes);

  try {
    const query = db("coaches")
      .join("classes", "classes.coach_id", "=", "coaches.id")
      .select(["coaches.*", "classes.*"]);

    // Adiciona o filtro de subject se estiver presente
    if (subject) {
      query.where("classes.subject", "=", subject);
    }

    // Adiciona o filtro de week_day e time se estiverem presentes
    if (week_day && timeInMinutes !== undefined) {
      query.whereExists(function () {
        this.select("classes_schedule.*")
          .from("classes_schedule")
          .whereRaw("`classes_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`classes_schedule`.`week_day` = ??", [Number(week_day)])
          .whereRaw("`classes_schedule`.`from` <= ??", [timeInMinutes])
          .whereRaw("`classes_schedule`.`to` > ??", [timeInMinutes]);
      });
    }

    const coaches = await query;

    return res.status(200).json(coaches);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar coaches." });
  }
});

routes.get("/coaches/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Reutiliza a consulta de coaches
    const coaches = await db("coaches")
      .join("classes", "classes.coach_id", "=", "coaches.id")
      .where("coaches.id", id) // Filtra pelo ID do coach
      .select(["coaches.*", "classes.*"]);

    if (coaches.length === 0) {
      return res.status(404).json({ message: "Coach não encontrado." });
    }

    return res.status(200).json(coaches); // Retorna o coach encontrado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar coach." });
  }
});

routes.delete("/coaches/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRows = await db("coaches").where("id", id).del();

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Coach não encontrado." });
    }

    return res.status(200).json({ message: "Coach deletado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar coach." });
  }
});

routes.delete("/classes_schedule/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedRows = await db("classes_schedule").where("id", id).del();

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Horário não encontrado." });
    }

    return res.status(200).json({ message: "Horário deletado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar horário." });
  }
});

export default routes;
