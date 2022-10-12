/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {

  async function createBranchRule(context,owner,repo,branch){
    await context.octokit.repos.updateBranchProtection({
      owner,
      repo,
      branch,
      required_status_checks: null,
      enforce_admins: false,
      required_pull_request_reviews: {
        require_code_owner_reviews: true,
        required_approving_review_count: 3
      },
      restrictions: null,
      require_linear_history: true,
      allow_deletions: true,
      required_conversation_resolution: true
    });
  }


  app.on("installation_repositories.added", async (context) => {
    const [owner,repo] = context.payload.repositories_added[0].full_name.split("/");

    const branches = await context.octokit.repos.listBranches({
      owner,
      repo
    })
    const defaultBranch = branches.data[0].name;
    // app.log.info(defaultBranch);

    const data = await context.octokit.repos.getCommit({
      owner,
      repo,
      ref: "refs/heads/"+defaultBranch
    });

    app.log.info(data)
    const sha = data.data.sha;
    app.log.info(sha)
    await context.octokit.git.createRef({
      owner,
      repo,
      ref: "refs/heads/release",
      sha
    })

    const branchCreated = await context.octokit.git.createRef({
      owner,
      repo,
      ref: "refs/heads/dev",
      sha
    })

    await createBranchRule(context,owner,repo,defaultBranch);
    await createBranchRule(context,owner,repo,"release");
    await createBranchRule(context,owner,repo,"dev");

    
  })


};

