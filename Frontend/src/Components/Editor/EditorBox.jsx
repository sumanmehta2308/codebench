import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  getdefaultlangtempService,
  updatedefaultlangService,
  updateTemplateService,
} from "../../Services/Problem.service.js";
import { isLoggedIn } from "../../Services/Auth.service.js";
import Loading from "../Loading/Loading.jsx";
import {
  runExampleCasesService,
  submitCodeService,
} from "../../Services/CodeRun.service.js";
import Executing from "./Executing.jsx";
import LoginToCode from "./LoginToCode.jsx";
import ExampleCasesOutput from "./ExampleCasesOutput.jsx";
import SampleCases from "./SampleCases.jsx";
import SubmissionResult from "./SubmissionResult.jsx";

function EditorBox({ problem, onSubmissionSuccess }) {
  const defaultCodes = {
    cpp: `#include<bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n\n    return 0;\n}`,
    c: `#include<stdio.h>\n\nint main() {\n    // Your code here\n\n    return 0;\n}`,
    java: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    python: `def main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()`,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [template, setTemplate] = useState(defaultCodes);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultCodes.cpp);
  const [theme, setTheme] = useState("vs-dark");
  const [exampleCasesExecution, setExampleCasesExecution] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setsubmissionStatus] = useState(null);

  const loadTemplateAndLanguage = async () => {
    const data = await getdefaultlangtempService();
    if (data) {
      setTemplate(data.template || defaultCodes);
      setLanguage(data.default_language || "cpp");
      setCode(
        data.template?.[data.default_language] ||
          defaultCodes[data.default_language || "cpp"]
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTemplateAndLanguage();
  }, []);

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    setCode(template[newLanguage] || defaultCodes[newLanguage]);
    await updatedefaultlangService(newLanguage);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const clickRun = async () => {
    setExampleCasesExecution(null);
    setsubmissionStatus(null);
    setExecuting(true);
    const response = await runExampleCasesService(
      language,
      code,
      problem.example_cases
    );
    if (response) {
      setExampleCasesExecution(response);
    }
    setExecuting(false);
  };

  const submitCode = async () => {
    setExampleCasesExecution(null);
    setsubmissionStatus(null);
    setSubmitting(true);
    const response = await submitCodeService(language, code, problem._id);
    if (response) {
      setsubmissionStatus(response);
      // Logic Fix: Trigger refresh in parent component to update Submissions tab
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    }
    setSubmitting(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      {!isLoggedIn() ? (
        <LoginToCode />
      ) : (
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900 border-b-2 border-gray-700 pb-4 gap-4 px-2 md:px-0">
            <div className="flex space-x-2 md:space-x-4 w-full md:w-auto">
              <button
                onClick={clickRun}
                className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Run
              </button>
              {problem && (
                <button
                  onClick={submitCode}
                  className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Submit
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4 md:space-x-4 items-center rounded-t-lg w-full md:w-auto">
              <select
                onChange={(e) => handleLanguageChange(e.target.value)}
                value={language}
                className="p-1 md:p-2 text-sm md:text-base text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 flex-1 md:flex-none"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>

              <select
                onChange={(e) => handleThemeChange(e.target.value)}
                value={theme}
                className="p-1 md:p-2 text-sm md:text-base text-white bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 flex-1 md:flex-none"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>

              <button
                className="w-full md:w-auto px-2 py-2 text-sm md:text-base text-white bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={async () => {
                  await updateTemplateService(language, { code });
                  setIsLoading(true);
                  loadTemplateAndLanguage();
                }}
              >
                Set as Template
              </button>
            </div>
          </div>

          <div className="p-3 md:p-5 bg-gray-800 rounded-lg shadow-lg my-4 w-full">
            <Editor
              height="63vh"
              width="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={(e) => setCode(e)}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
              className="rounded-lg overflow-hidden border border-gray-700"
            />
          </div>

          <div className="mt-4 px-2 md:px-0">
            {submitting ? (
              <Executing text={"Submitting"} />
            ) : submissionStatus ? (
              <SubmissionResult submissionStatus={submissionStatus} />
            ) : executing ? (
              <Executing text={"Executing"} />
            ) : (
              <>
                {exampleCasesExecution ? (
                  <ExampleCasesOutput
                    exampleCasesExecution={exampleCasesExecution}
                  />
                ) : (
                  <SampleCases example_cases={problem.example_cases} />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorBox;
