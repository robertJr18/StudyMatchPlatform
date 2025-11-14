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
        has_monitors: false,
      },
    ];

    console.log("📚 Insertando materias...");
    const { error: subjectsError } = await supabase.from("subjects").upsert(subjects);
    if (subjectsError) {
      console.error("❌ Error insertando materias:", subjectsError);
    } else {
      console.log("✅ Materias insertadas/actualizadas");
    }

    // 3. Crear enrollments para Robert (5 materias)
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
      console.log("✅ Enrollments de Robert insertados (5 materias)");
    }

    // 4. Crear monitor para Jussi en Gestión de Proyectos
    const jussiId = users[1].id;
    const gestionProyectosId = subjects[1].id; // Gestión de Proyectos

    console.log("👨‍🏫 Insertando monitor (Jussi)...");
    const { error: monitorError } = await supabase
      .from("monitors")
      .upsert({
        id: "750e8400-e29b-41d4-a716-446655440001",
        user_id: jussiId,
        subject_id: gestionProyectosId,
      });

    if (monitorError) {
      console.error("❌ Error insertando monitor:", monitorError);
    } else {
      console.log("✅ Monitor insertado (Jussi en Gestión de Proyectos)");
    }

    console.log("\n🎉 Setup completado exitosamente!");
    console.log("\n📋 Resumen:");
    console.log("- 3 usuarios creados (Robert, Jussi, Admin)");
    console.log("- 5 materias creadas");
    console.log("- 5 enrollments para Robert");
    console.log("- 1 monitor (Jussi en Gestión de Proyectos)");
    console.log("\n💡 Ahora puedes hacer login con:");
    console.log("   - robert.gonzalez@universidad.edu.co / 123");
    console.log("   - jussi.torres@universidad.edu.co / 123");
    console.log("   - admin@universidad.edu.co / 123");

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
