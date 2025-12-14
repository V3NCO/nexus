<!-- JS Part -->
<script lang="ts">
    import Time from "svelte-time";
    import { onMount } from 'svelte';

    let contributions: any = [];
    let loading: boolean = true;
    let error: any = null;

    const fetchGitHub = async () => {
      const response = await fetch(`/api/github/lastCommit`);
      return response.json();
    };

    const trimCommitMessage = (message:  string): string => {
      if (message.length >= 25) {
        return message.substring(0, 22) + "...";
      }
      return message;
    };

    function getLastMonthContributions(calendarData: any) {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(today.getDay() - 30);

        // Get all days and filter by date
        const allDays = calendarData.weeks.flatMap((week: any) => week.contributionDays);
        const filteredDays = allDays.filter((day: any) => {
          const dayDate = new Date(day.date);
          return dayDate >= oneMonthAgo && dayDate <= today;
        });

        // Organize into a 7x7 grid (7 weeks, 7 days each)
        const weeks: any[][] = [];

        // Find the start of the grid (go back to include partial weeks)
        const startDate = filteredDays.length > 0 ? new Date(filteredDays[0].date) : today;
        const startDayOfWeek = startDate.getDay(); // 0-6 (Sun-Sat)

        // Calculate how many days back we need to go to start on Sunday
        const daysToGoBack = startDayOfWeek;
        const gridStartDate = new Date(startDate);
        gridStartDate.setDate(gridStartDate.getDate() - daysToGoBack);

        // Create 7 weeks (columns)
        for (let weekIndex = 0; weekIndex < 7; weekIndex++) {
          const week: any[] = [];

          // Create 7 days (rows) for each week
          for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const currentDate = new Date(gridStartDate);
            currentDate.setDate(currentDate.getDate() + (weekIndex * 7) + dayIndex);

            // Find if we have contribution data for this date
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = filteredDays.find((d: any) => d.date === dateStr);

            if (dayData) {
              week.push(dayData);
            } else {
              week.push({
                date: dateStr,
                contributionCount:  0
              });
            }
          }

          weeks.push(week);
        }

        return weeks;
    }

    function getColor(count: number): string {
        if (count === 0) return '#ebedf0';
        if (count < 3) return '#9be9a8';
        if (count < 6) return '#40c463';
        if (count < 9) return '#30a14e';
        return '#216e39';
    }

    onMount(async () => {
        try {
          const response = await fetch(`/api/github/graph`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error);
          }

          contributions = getLastMonthContributions(data);
          loading = false;
        } catch (err:  any) {
          error = err.message;
          loading = false;
        }
    });

    function formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
</script>
<!-- HTML Part -->
<div class="git item-wide">
    <div class="box">
        <section>
            <div class="item last-commit">
                {#await fetchGitHub()}
                    <p>Waiting for repo</p>
                {:then response}
                    <a href="{response.author.html_url}">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <img src={response.author.avatar_url} alt="{response.author.login}" width="20" height="20" style="border-radius: 20px;">
                            <span style="font-weight: 700;">{response.commit.author.name}</span>
                            <span><Time relative timestamp="{response.commit.author.date}" style="color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                        </div>
                    </a>
                    <a style="font-weight: 700; font-size: 16px;" href="{response.html_url}">
                        {trimCommitMessage(response.commit.message)}
                    </a>
                    {#if response.commit.verification.verified}
                        <div style="outline-color: #238636; outline-width: 1px; outline-style: solid; border-radius: 50px; width: min-content; display: flex; align-items: center;">
                            <p style="font-weight: 500; color: #3fb950; margin-left: 10px; margin-right: 5px;">✓</p>
                            <p style="font-weight: 500; color: #3fb950; margin-right: 10px;">Verified</p>
                        </div>
                    {:else}
                        <div style="outline-color: #da3633; outline-width: 1px; outline-style: solid; border-radius: 50px; width: min-content; display: flex; align-items: center;">
                            <p style="font-weight: 500; color: #da3633; margin-left: 10px; margin-right: 5px;">⨯</p>
                            <p style="font-weight: 500; color: #da3633; margin-right: 10px;">Unsigned</p>
                        </div>
                    {/if}
                    <a href="{response.html_url.replace(`/commit/${response.sha}`, '')}">
                    <p style="font-weight: 600; margin-top: 10px;">Repo: {response.html_url.replace(`/commit/${response.sha}`, '').replace(`https://github.com/${response.author.login}/`, '')}</p>
                    </a>
                    <div style="width: min-content; display: flex; align-items: center; margin-top: 10px;">
                        <p style="font-weight: 600; margin-right: 10px;">Additions: </p>
                        <p style="font-weight: 600; color: #3fb950; margin-right: 10px;">+{response.stats.additions}</p>
                    </div>
                    <div style="width: min-content; display: flex; align-items: center; margin-top: 10px;">
                        <p style="font-weight: 600; margin-right: 10px;">Deletions: </p>
                        <p style="font-weight: 600; color: #da3633; margin-right: 10px;">-{response.stats.deletions}</p>
                    </div>

                {/await}
            </div>
            <div class="item activity-graph">
                {#if loading}
                    <p>Loading...</p>
                {:else if error}
                    <p class="error">Error: {error}</p>
                {:else}
                    <div class="graph-wrapper">
                        <div class="graph-container">
                            {#each contributions as week}
                                <div class="week-column">
                                    {#each week as day}
                                        <div
                                            class="contribution-day"
                                            style="background-color: {getColor(day.contributionCount)}"
                                            title="{day.contributionCount} contributions on {formatDate(day.date)}"
                                        >
                                            <span class="tooltip">
                                                {day.contributionCount} contributions on {formatDate(day.date)}
                                            </span>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </section>
    </div>
</div>

<!-- CSS Part -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

    .box {
        background-color: #EFEFEF;
        border-radius: 50px;
        position: absolute;
        inset: 10px;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .item {
      flex-basis: 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 2em;
      padding-bottom: 2em;
    }
    .last-commit {
        padding-left: 2em;
        padding-right: 0.5em;
    }
    .activity-graph {
        padding-left: 0.5em;
        padding-right: 2em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 0;
    }

    section {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }


    .graph-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        min-height: 0;
        width: 100%;
    }
    .graph-container {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: min(0.5vw, 4px);
        width: 100%;
        max-width: min(100%, 300px);
        aspect-ratio: 1 / 1;
    }
    .week-column {
        display: grid;
        grid-template-rows: repeat(7, 1fr);
        gap: min(0.5vw, 4px);
        height: 100%;
    }
    .contribution-day {
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        border-radius:  15%;
        position: relative;
        cursor: pointer;
        transition: transform 0.1s;
        outline: 1px solid black;
    }
    .contribution-day:hover {
        transform: scale(1.4);
        outline: 1px solid rgba(0, 0, 0, 0.3);
        z-index: 10;
    }
    .contribution-day .tooltip {
        display: none;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background:  rgba(0, 0, 0, 0.9);
        color: white;
        padding: 6px 10px;
        border-radius:  6px;
        font-size:  11px;
        white-space: nowrap;
        z-index: 100;
        pointer-events: none;
    }
    .contribution-day .tooltip::after {
        content:  '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.9);
    }
    .contribution-day:hover .tooltip {
        display: block;
    }
    .error {
        color: #da3633;
        font-weight:  600;
    }
</style>
