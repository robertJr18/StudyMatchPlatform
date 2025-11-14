import { supabase } from "@/integrations/supabase/client";

/**
 * Script para configurar datos de prueba en StudyMatch
 * Ejecuta esto desde la consola del navegador si necesitas reiniciar los datos
 */
export async function setupTestData() {
  console.log("🚀 Iniciando setup de datos de prueba...");

  try {
    // 1. Crear/verificar usuarios
    const users = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        email: "robert.gonzalez@universidad.edu.co",
        full_name: "Robert González",
        role: "student" as const,
        career: "Ingeniería de Sistemas",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        email: "jussi.torres@universidad.edu.co",
        full_name: "Jussi Torres",
        role: "monitor" as const,
        career: "Ingeniería de Sistemas",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        email: "admin@universidad.edu.co",
        full_name: "Administrador",
        role: "admin" as const,
        career: null,
      },
      // Nuevos monitores
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        email: "maria.rodriguez@universidad.edu.co",
        full_name: "María Rodríguez",
        role: "monitor" as const,
        career: "Ingeniería de Sistemas",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        email: "carlos.martinez@universidad.edu.co",
        full_name: "Carlos Martínez",
        role: "monitor" as const,
        career: "Ingeniería de Sistemas",
      },
    ];

    console.log("👤 Insertando usuarios...");
    const { error: usersError } = await supabase.from("users").upsert(users);
    if (usersError) {
      console.error("❌ Error insertando usuarios:", usersError);
    } else {
      console.log("✅ Usuarios insertados/actualizados");
    }

    // 2. Crear materias
    const subjects = [
      {
        id: "650e8400-e29b-41d4-a716-446655440001",
        name: "Compiladores",
        code: "COMP301",
        career: "Ingeniería de Sistemas",
        has_monitors: false,
      },
      {
        id: "650e8400-e29b-41d4-a716-446655440002",
        name: "Gestión de Proyectos",
        code: "PROY101",
        career: "Ingeniería de Sistemas",
        has_monitors: true,
      },
      {
        id: "650e8400-e29b-41d4-a716-446655440003",
        name: "Calor y Ondas",
        code: "FIS201",
        career: "Ingeniería de Sistemas",
        has_monitors: false,
      },
      {
        id: "650e8400-e29b-41d4-a716-446655440004",
        name: "English V",
        code: "ENG105",
        career: "Ingeniería de Sistemas",
        has_monitors: false,
      },
      {
        id: "650e8400-e29b-41d4-a716-446655440005",
        name: "Programación para Web",
        code: "WEB301",
        career: "Ingeniería de Sistemas",
        has_monitors: true,
      },
      {
        id: "650e8400-e29b-41d4-a716-446655440006",
        name: "Matemáticas Discretas",
        code: "MAT201",
        career: "Ingeniería de Sistemas",
        has_monitors: true,
      },
    ];

    console.log("📚 Insertando materias...");
    const { error: subjectsError } = await supabase.from("subjects").upsert(subjects);
    if (subjectsError) {
      console.error("❌ Error insertando materias:", subjectsError);
    } else {
      console.log("✅ Materias insertadas/actualizadas");
    }

    // 3. Crear enrollments para Robert (6 materias)
    const robertId = users[0].id;
    const enrollments = subjects.map((subject) => ({
      student_id: robertId,
      subject_id: subject.id,
    }));

    console.log("📝 Insertando enrollments de Robert...");
    // First delete existing enrollments for Robert to avoid duplicates
    await supabase.from("enrollments").delete().eq("student_id", robertId);

    const { error: enrollmentsError } = await supabase.from("enrollments").insert(enrollments);
    if (enrollmentsError) {
      console.error("❌ Error insertando enrollments:", enrollmentsError);
    } else {
      console.log("✅ Enrollments de Robert insertados (6 materias)");
    }

    // 4. Crear monitores
    const monitors = [
      {
        id: "750e8400-e29b-41d4-a716-446655440001",
        user_id: users[1].id, // Jussi
        subject_id: subjects[1].id, // Gestión de Proyectos
      },
      {
        id: "750e8400-e29b-41d4-a716-446655440002",
        user_id: users[3].id, // María
        subject_id: subjects[4].id, // Programación para Web
      },
      {
        id: "750e8400-e29b-41d4-a716-446655440003",
        user_id: users[4].id, // Carlos
        subject_id: subjects[5].id, // Matemáticas Discretas
      },
    ];

    console.log("👨‍🏫 Insertando monitores...");
    const { error: monitorError } = await supabase.from("monitors").upsert(monitors);

    if (monitorError) {
      console.error("❌ Error insertando monitores:", monitorError);
    } else {
      console.log("✅ Monitores insertados (3 monitores)");
    }

    // 5. Crear horarios para cada materia con monitor
    const timeSlots = [
      // Gestión de Proyectos - Jussi
      {
        id: "850e8400-e29b-41d4-a716-446655440001",
        subject_id: subjects[1].id,
        monitor_id: monitors[0].id,
        day_of_week: "Lunes",
        start_time: "14:00",
        end_time: "16:00",
        location: "Edificio A - Salón 301",
        max_capacity: 30,
      },
      {
        id: "850e8400-e29b-41d4-a716-446655440002",
        subject_id: subjects[1].id,
        monitor_id: monitors[0].id,
        day_of_week: "Miércoles",
        start_time: "16:00",
        end_time: "18:00",
        location: "Edificio B - Salón 205",
        max_capacity: 30,
      },
      // Programación para Web - María
      {
        id: "850e8400-e29b-41d4-a716-446655440003",
        subject_id: subjects[4].id,
        monitor_id: monitors[1].id,
        day_of_week: "Martes",
        start_time: "10:00",
        end_time: "12:00",
        location: "Laboratorio de Computación 3",
        max_capacity: 25,
      },
      {
        id: "850e8400-e29b-41d4-a716-446655440004",
        subject_id: subjects[4].id,
        monitor_id: monitors[1].id,
        day_of_week: "Jueves",
        start_time: "14:00",
        end_time: "16:00",
        location: "Laboratorio de Computación 3",
        max_capacity: 25,
      },
      // Matemáticas Discretas - Carlos
      {
        id: "850e8400-e29b-41d4-a716-446655440005",
        subject_id: subjects[5].id,
        monitor_id: monitors[2].id,
        day_of_week: "Lunes",
        start_time: "08:00",
        end_time: "10:00",
        location: "Edificio C - Salón 102",
        max_capacity: 35,
      },
      {
        id: "850e8400-e29b-41d4-a716-446655440006",
        subject_id: subjects[5].id,
        monitor_id: monitors[2].id,
        day_of_week: "Viernes",
        start_time: "10:00",
        end_time: "12:00",
        location: "Edificio C - Salón 102",
        max_capacity: 35,
      },
    ];

    console.log("🕐 Insertando horarios...");
    const { error: timeSlotsError } = await supabase.from("time_slots").upsert(timeSlots);
    if (timeSlotsError) {
      console.error("❌ Error insertando horarios:", timeSlotsError);
    } else {
      console.log("✅ Horarios insertados (6 horarios)");
    }

    // 6. Crear materiales de estudio
    const materials = [
      // Gestión de Proyectos
      {
        id: "950e8400-e29b-41d4-a716-446655440001",
        subject_id: subjects[1].id,
        monitor_id: monitors[0].id,
        title: "Guía de Scrum y Agile",
        description: "Fundamentos de metodologías ágiles para gestión de proyectos",
        file_url: "https://drive.google.com/file/d/ejemplo-scrum",
      },
      {
        id: "950e8400-e29b-41d4-a716-446655440002",
        subject_id: subjects[1].id,
        monitor_id: monitors[0].id,
        title: "Plantilla Project Charter",
        description: "Documento base para iniciar proyectos",
        file_url: "https://drive.google.com/file/d/ejemplo-charter",
      },
      // Programación para Web
      {
        id: "950e8400-e29b-41d4-a716-446655440003",
        subject_id: subjects[4].id,
        monitor_id: monitors[1].id,
        title: "Introducción a React y TypeScript",
        description: "Guía completa para comenzar con React usando TypeScript",
        file_url: "https://drive.google.com/file/d/ejemplo-react",
      },
      {
        id: "950e8400-e29b-41d4-a716-446655440004",
        subject_id: subjects[4].id,
        monitor_id: monitors[1].id,
        title: "CSS Grid y Flexbox Cheatsheet",
        description: "Referencia rápida de layouts modernos en CSS",
        file_url: "https://drive.google.com/file/d/ejemplo-css",
      },
      {
        id: "950e8400-e29b-41d4-a716-446655440005",
        subject_id: subjects[4].id,
        monitor_id: monitors[1].id,
        title: "API REST con Node.js",
        description: "Tutorial para crear APIs RESTful con Express",
        file_url: "https://drive.google.com/file/d/ejemplo-nodejs",
      },
      // Matemáticas Discretas
      {
        id: "950e8400-e29b-41d4-a716-446655440006",
        subject_id: subjects[5].id,
        monitor_id: monitors[2].id,
        title: "Teoría de Grafos - Ejercicios Resueltos",
        description: "Problemas resueltos de grafos con explicaciones detalladas",
        file_url: "https://drive.google.com/file/d/ejemplo-grafos",
      },
      {
        id: "950e8400-e29b-41d4-a716-446655440007",
        subject_id: subjects[5].id,
        monitor_id: monitors[2].id,
        title: "Lógica Proposicional y Tablas de Verdad",
        description: "Guía práctica de lógica matemática",
        file_url: "https://drive.google.com/file/d/ejemplo-logica",
      },
      {
        id: "950e8400-e29b-41d4-a716-446655440008",
        subject_id: subjects[5].id,
        monitor_id: monitors[2].id,
        title: "Combinatoria - Fórmulas y Aplicaciones",
        description: "Resumen de combinatoria con ejemplos",
        file_url: "https://drive.google.com/file/d/ejemplo-combinatoria",
      },
    ];

    console.log("📄 Insertando materiales...");
    const { error: materialsError } = await supabase.from("materials").upsert(materials);
    if (materialsError) {
      console.error("❌ Error insertando materiales:", materialsError);
    } else {
      console.log("✅ Materiales insertados (8 materiales)");
    }

    console.log("\n🎉 Setup completado exitosamente!");
    console.log("\n📋 Resumen:");
    console.log("- 5 usuarios creados (Robert, Jussi, Admin, María, Carlos)");
    console.log("- 6 materias creadas");
    console.log("- 6 enrollments para Robert");
    console.log("- 3 monitores (Jussi, María, Carlos)");
    console.log("- 6 horarios disponibles");
    console.log("- 8 materiales de estudio");
    console.log("\n💡 Ahora puedes hacer login con:");
    console.log("   - robert.gonzalez@universidad.edu.co / 123");
    console.log("   - jussi.torres@universidad.edu.co / 123");
    console.log("   - admin@universidad.edu.co / 123");

    console.log("\n⚠️ IMPORTANTE: Si no ves las materias de Robert:");
    console.log("Las políticas RLS de Supabase están bloqueando las consultas.");
    console.log("📖 Abre el archivo FIX_RLS.md para ver la solución (muy fácil).");
    console.log("🔧 Resumen: Ir a Supabase Dashboard → SQL Editor y ejecutar:");
    console.log("   ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;");

    return { success: true };
  } catch (error) {
    console.error("❌ Error en setup:", error);
    return { success: false, error };
  }
}

// Exponer en window para uso desde consola
if (typeof window !== "undefined") {
  (window as any).setupTestData = setupTestData;
}
