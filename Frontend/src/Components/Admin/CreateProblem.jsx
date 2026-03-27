import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  createproblem,
  getProblemService,
  updateProblemService,
} from "../../Services/Problem.service.js";
import {
  CheckCircleIcon,
  BeakerIcon,
  CodeBracketIcon,
  ListBulletIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CreateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 庁 MAGIC FLAG: Automatically determines if we are editing or creating based on the URL
  const isEditMode = Boolean(id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      constraints: [""],
      example_cases: [{ input: "", output: "", explanation: "" }],
      test_cases: [{ input: "", output: "" }],
      solution: { c: "", cpp: "", java: "", python: "" },
      input_format: "",
      output_format: "",
    },
  });

  // Load existing data ONLY if we are in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchExistingData = async () => {
        const data = await getProblemService(id);
        if (data) {
          reset(data); // Instantly maps database fields to form inputs
        }
      };
      fetchExistingData();
    }
  }, [id, isEditMode, reset]);

  const {
    fields: exFields,
    append: appendEx,
    remove: removeEx,
  } = useFieldArray({ control, name: "example_cases" });

  const {
    fields: testFields,
    append: appendTest,
    remove: removeTest,
  } = useFieldArray({ control, name: "test_cases" });

  const {
    fields: constraintFields,
    append: appendConstraint,
    remove: removeConstraint,
  } = useFieldArray({ control, name: "constraints" });

  const onSubmit = async (data) => {
    // Advanced data cleaning with optional chaining (?.) for safety
    const cleanedData = {
      ...data,
      title: data.title?.trim() || "",
      description: data.description?.trim() || "",
      input_format: data.input_format?.trim() || "",
      output_format: data.output_format?.trim() || "",
      constraints: (data.constraints || [])
        .map((c) => (typeof c === "string" ? c.trim() : c))
        .filter((c) => c !== ""),
      example_cases: (data.example_cases || []).map((ec) => ({
        input: ec.input?.trim() || "",
        output: ec.output?.trim() || "",
        explanation: ec.explanation?.trim() || "",
      })),
      test_cases: (data.test_cases || []).map((tc) => ({
        input: tc.input?.trim() || "",
        output: tc.output?.trim() || "",
      })),
      solution: {
        c: data.solution?.c?.trim() || "",
        cpp: data.solution?.cpp?.trim() || "",
        java: data.solution?.java?.trim() || "",
        python: data.solution?.python?.trim() || "",
      },
    };

    try {
      // 庁 DECISION LOGIC: Call Update or Call Create based on mode
      if (isEditMode) {
        const success = await updateProblemService(id, cleanedData);
        if (success) {
          toast.success("Problem updated successfully!");
          navigate("/admin");
        }
      } else {
        const response = await createproblem(cleanedData);
        if (response) {
          toast.success("Problem published successfully!");
          navigate("/admin");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(
        isEditMode ? "Failed to update problem." : "Failed to save problem."
      );
    }
  };

  const inputClass =
    "input input-bordered bg-slate-900/50 border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-200";
  const labelClass =
    "label-text font-bold text-slate-400 mb-2 block uppercase tracking-wider text-xs";
  const sectionClass =
    "bg-slate-800/40 p-5 md:p-8 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm mb-8";

  return (
    <div className="min-h-screen bg-slate-950 py-8 md:py-12 px-4 sm:px-10 text-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Header - Made Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {isEditMode ? "Modify" : "Create"}{" "}
              <span className={isEditMode ? "text-info" : "text-blue-500"}>
                Challenge
              </span>
            </h1>
            <p className="text-slate-500 font-medium">
              {isEditMode
                ? "Updating existing algorithmic problem."
                : "Draft a new algorithmic problem for the community."}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-ghost text-slate-400 normal-case w-full md:w-auto"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="pb-20">
          {/* SECTION 1: BASIC INFO */}
          <div className={sectionClass}>
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
              <CheckCircleIcon className="w-6 h-6" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Problem Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder={!isEditMode ? "e.g. Transaction Integrity" : ""}
                  className={`${inputClass} w-full h-12`}
                />
              </div>
              <div>
                <label className={labelClass}>Difficulty</label>
                <select
                  {...register("difficulty")}
                  className="select select-bordered w-full bg-slate-900/50 border-slate-700 text-slate-200 h-12"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="mt-8">
              <label className={labelClass}>Description (Markdown)</label>
              <textarea
                {...register("description", { required: true })}
                placeholder={!isEditMode ? "Describe the problem..." : ""}
                className="textarea textarea-bordered w-full h-48 bg-slate-950 border-slate-700 text-base"
              />
            </div>
          </div>

          {/* SECTION 2: I/O & CONSTRAINTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className={sectionClass + " mb-0"}>
              <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <ListBulletIcon className="w-6 h-6" /> I/O Format
              </h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Input Format</label>
                  <textarea
                    {...register("input_format")}
                    className="textarea textarea-bordered w-full bg-slate-950 border-slate-700 text-sm"
                    rows="3"
                  />
                </div>
                <div>
                  <label className={labelClass}>Output Format</label>
                  <textarea
                    {...register("output_format")}
                    className="textarea textarea-bordered w-full bg-slate-950 border-slate-700 text-sm"
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div className={sectionClass + " mb-0"}>
              <h2 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                <BeakerIcon className="w-6 h-6" /> Constraints
              </h2>
              <div className="space-y-3">
                {constraintFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <input
                      {...register(`constraints.${index}`)}
                      className={`${inputClass} flex-1 input-sm`}
                    />
                    <button
                      type="button"
                      onClick={() => removeConstraint(index)}
                      className="btn btn-sm btn-ghost text-rose-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendConstraint("")}
                  className="btn btn-xs btn-ghost text-purple-400"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Constraint
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: EXAMPLES */}
          <div className={sectionClass}>
            <h2 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
              <CodeBracketIcon className="w-6 h-6" /> Example Test Cases
            </h2>
            {exFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-700 relative mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Input</label>
                    <textarea
                      {...register(`example_cases.${index}.input`)}
                      className="textarea textarea-bordered w-full bg-slate-950 font-mono text-xs"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Output</label>
                    <textarea
                      {...register(`example_cases.${index}.output`)}
                      className="textarea textarea-bordered w-full bg-slate-950 font-mono text-xs"
                      rows="3"
                    />
                  </div>
                </div>
                <label className={labelClass}>Explanation</label>
                <textarea
                  {...register(`example_cases.${index}.explanation`)}
                  className="textarea textarea-bordered w-full h-16 bg-slate-950 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeEx(index)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 text-rose-500 bg-slate-900 p-1 rounded-full"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                appendEx({ input: "", output: "", explanation: "" })
              }
              className="btn btn-outline btn-sm w-full sm:w-auto btn-warning"
            >
              Add Example
            </button>
          </div>

          {/* SECTION 4: HIDDEN TEST CASES */}
          <div className={sectionClass}>
            <h2 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
              <BeakerIcon className="w-6 h-6" /> Hidden Test Cases
            </h2>
            {testFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-rose-900/30 relative mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Input</label>
                    <textarea
                      {...register(`test_cases.${index}.input`)}
                      className="textarea textarea-bordered w-full bg-slate-950 font-mono text-xs"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Output</label>
                    <textarea
                      {...register(`test_cases.${index}.output`)}
                      className="textarea textarea-bordered w-full bg-slate-950 font-mono text-xs"
                      rows="3"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTest(index)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 text-rose-500 bg-slate-900 p-1 rounded-full"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTest({ input: "", output: "" })}
              className="btn btn-outline w-full sm:w-auto btn-sm btn-error"
            >
              Add Hidden Case
            </button>
          </div>

          {/* SECTION 5: SOLUTIONS */}
          <div className={sectionClass}>
            <h2 className="text-xl font-bold text-indigo-400 mb-6">
              Expert Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["cpp", "java", "python", "c"].map((lang) => (
                <div key={lang}>
                  <label className={labelClass}>
                    {lang.toUpperCase()} Solution
                  </label>
                  <textarea
                    {...register(`solution.${lang}`)}
                    className="textarea textarea-bordered w-full h-48 bg-slate-950 font-mono text-sm border-slate-800"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 z-50 mt-12 pb-8 pt-4">
            <button
              type="submit"
              className={`btn ${
                isEditMode ? "btn-info" : "btn-primary"
              } btn-lg w-full rounded-2xl`}
            >
              {isEditMode
                ? "Save Modifications"
                : "Publish Challenge to Production"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateProblem;
